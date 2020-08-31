import { EventEmitter } from 'events'
const bip39 = require('bip39')
const ObservableStore = require('obs-store')
const encryptor = require('browser-passworder')
import SimpleKeyring from 'fluree-simple-keyring'
import HdKeyring from 'fluree-hd-keyring'
import Query from 'flureejs-query'
import Transaction from 'flureejs-tx'
import Request from 'flureejs-request'

const keyringTypes = [SimpleKeyring, HdKeyring]

export default class KeyringController extends EventEmitter {
  store: any
  memStore: any
  encryptor: any
  keyrings: Array<any>
  private keyringTypes: any[]
  password!: string | undefined
  initState: Object

  //
  // PUBLIC METHODS
  //

  constructor(opts?: any) {
    super()
    this.initState = opts.initState || {}
    this.keyringTypes = opts.keyringTypes ? keyringTypes.concat(opts.keyringTypes) : keyringTypes
    this.store = new ObservableStore(this.initState)
    this.memStore = new ObservableStore({
      isUnlocked: false,
      keyringTypes: this.keyringTypes.map((krt: any) => krt.type),
      keyrings: [],
    })

    this.encryptor = opts.encryptor || encryptor
    this.keyrings = []
  }

  /**
   * Full Update
   *
   * Emits the `update` event and @returns a Promise that resolves to
   * the current state.
   *
   * Frequently used to end asynchronous chains in this class,
   * indicating consumers can often either listen for updates,
   * or accept a state-resolving promise to consume their results.
   *
   * @returns {Object} The controller state.
   */
  public fullUpdate() {
    this.emit('update', this.memStore.getState())
    return this.memStore.getState()
  }

  /**
   * Create New Vault And Keychain
   *
   * Destroys any old encrypted storage,
   * creates a new encrypted store with the given password,
   * randomly creates a new HD wallet with 1 account,
   * faucets that account on the testnet.
   *
   * @emits KeyringController#unlock
   * @param {string} password - The password to encrypt the vault with.
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  public createNewVaultAndKeychain(password: string) {
    return this.persistAllKeyrings(password)
      .then(this.createFirstKeyTree.bind(this))
      .then(this.persistAllKeyrings.bind(this, password))
      .then(this.setUnlocked.bind(this))
      .then(this.fullUpdate.bind(this))
  }

  /**
   * CreateNewVaultAndRestore
   *
   * Destroys any old encrypted storage,
   * creates a new encrypted store with the given password,
   * creates a new HD wallet from the given seed with 1 account.
   *
   * @emits KeyringController#unlock
   * @param {string} password - The password to encrypt the vault with
   * @param {string} seed - The BIP44-compliant seed phrase.
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  public createNewVaultAndRestore(password: string, seed: string) {
    if (typeof password !== 'string') {
      return Promise.reject(new Error('Password must be text.'))
    }

    if (!bip39.validateMnemonic(seed)) {
      return Promise.reject(new Error('Seed phrase is invalid.'))
    }

    return this.clearKeyrings()
      .then(() => {
        return this.persistAllKeyrings(password)
      })
      .then(() => {
        return this.addNewKeyring('HD Key Tree', {
          mnemonic: seed,
          numberOfAccounts: 1,
        })
      })
      .then(firstKeyring => {
        return firstKeyring.getAccounts()
      })
      .then(([firstAccount]) => {
        if (!firstAccount) {
          throw new Error('KeyringController - First Account not found.')
        }
        return null
      })
      .then(this.persistAllKeyrings.bind(this, password))
      .then(this.setUnlocked.bind(this))
      .then(this.fullUpdate.bind(this))
  }

  /**
   * Set Locked
   * This method deallocates all secrets, and effectively locks MetaMask.
   *
   * @emits KeyringController#lock
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  public async setLocked() {
    this.password = undefined
    // set locked
    this.memStore.updateState({ isUnlocked: false })
    // remove keyrings
    this.keyrings = []
    await this.updateMemStoreKeyrings()
    this.emit('lock')
    return this.fullUpdate()
  }

  /**
   * Submit Password
   *
   * Attempts to decrypt the current vault and load its keyrings
   * into memory.
   *
   *
   * @emits KeyringController#unlock
   * @param {string} password - The keyring controller password.
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  public submitPassword(password: string) {
    return this.unlockKeyrings(password).then(keyrings => {
      this.keyrings = keyrings
      this.setUnlocked()
      return this.fullUpdate()
    })
  }

  /**
   * Verify Password
   *
   * Attempts to decrypt the current vault with a given password
   * to verify its validity.
   *
   * @param {string} password
   */
  public async verifyPassword(password: string) {
    const encryptedVault = this.store.getState().vault
    if (!encryptedVault) {
      throw new Error('Cannot unlock without a previous vault.')
    }
    await this.encryptor.decrypt(password, encryptedVault)
  }

  /**
   * Add New Keyring
   *
   * Adds a new Keyring of the given `type` to the vault
   * and the current decrypted Keyrings array.
   *
   * All Keyring classes implement a unique `type` string,
   * and this is used to retrieve them from the keyringTypes array.
   *
   * @param {string} type - The type of keyring to add.
   * @param {Object} opts - The constructor options for the keyring.
   * @returns {Promise<Keyring>} The new keyring.
   */
  public addNewKeyring(type: string, opts?: any) {
    const Keyring = this.getKeyringClassForType(type)
    const keyring = new Keyring(opts)
    return keyring
      .getAccounts()
      .then((accounts: Array<Buffer>) => {
        return this.checkForDuplicate(type, accounts)
      })
      .then(() => {
        this.keyrings.push(keyring)
        return this.persistAllKeyrings()
      })
      .then(() => this.updateMemStoreKeyrings())
      .then(() => this.fullUpdate())
      .then(() => {
        return keyring
      })
  }

  /**
   * Remove Empty Keyrings
   *
   * Loops through the keyrings and removes the ones with empty accounts
   * (usually after removing the last / only account) from a keyring
   */
  public async removeEmptyKeyrings() {
    const validKeyrings: Array<HdKeyring | SimpleKeyring> = []

    // Since getAccounts returns a Promise
    // We need to wait to hear back form each keyring
    // in order to decide which ones are now valid (accounts.length > 0)

    await Promise.all(
      this.keyrings.map(async (keyring: HdKeyring | SimpleKeyring) => {
        const accounts = await keyring.getAccounts()
        if (accounts.length > 0) {
          validKeyrings.push(keyring)
        }
      }),
    )
    this.keyrings = validKeyrings
  }

  /**
   * Checks for duplicate keypairs, using the the first account in the given
   * array. Rejects if a duplicate is found.
   *
   * Only supports 'Simple Key Pair'.
   *
   * @param {string} type - The key pair type to check for.
   * @param {Array<Buffer>} newAccountArray - Array of new accounts.
   * @returns {Promise<Array<Buffer>>} The account, if no duplicate is found.
   */
  public checkForDuplicate(type: string, newAccountArray: Array<Buffer>) {
    return this.getAccounts().then((accounts: Array<Buffer>) => {
      switch (type) {
        case 'Simple Key Pair': {
          const isIncluded = Boolean(
            accounts.find((key: Buffer) => Buffer.compare(key, newAccountArray[0]) === 0),
          )
          return isIncluded
            ? Promise.reject(new Error("The account you're are trying to import is a duplicate"))
            : Promise.resolve(newAccountArray)
        }
        default: {
          return Promise.resolve(newAccountArray)
        }
      }
    })
  }

  /**
   * Add New Account
   *
   * Calls the `addAccounts` method on the given keyring,
   * and then saves those changes.
   *
   * @param {Keyring} selectedKeyring - The currently selected keyring.
   * @returns {Promise<Object>} A Promise that resolves to the state.
   */
  public addNewAccount(selectedKeyring: any) {
    return selectedKeyring
      .addAccounts(1)
      .then((accounts: Array<Buffer>) => {
        accounts.forEach(account => {
          this.emit('newAccount', account)
        })
      })
      .then(this.persistAllKeyrings.bind(this))
      .then(this.updateMemStoreKeyrings.bind(this))
      .then(this.fullUpdate.bind(this))
  }

  /**
   * Export Account
   *
   * Requests the private key from the keyring controlling
   * the specified authID.
   *
   * Returns a Promise that may resolve with the private key Buffer.
   *
   * @param {Buffer} authID - The authID of the account to export.
   * @returns {Promise<Buffer>} The private key of the account.
   */
  public exportAccount(authID: Buffer) {
    try {
      return this.getKeyringForAccount(authID).then(keyring => {
        return keyring.exportAccount(authID)
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  /**
   *
   * Remove Account
   *
   * Removes a specific account from a keyring
   * If the account is the last/only one then it also removes the keyring.
   *
   * @param {Buffer} authID - The authID of the account to remove.
   * @returns {Promise<void>} A Promise that resolves if the operation was successful.
   */
  public removeAccount(authID: Buffer) {
    return this.getKeyringForAccount(authID)
      .then(keyring => {
        // Not all the keyrings support this, so we have to check
        if (typeof keyring.removeAccount === 'function') {
          keyring.removeAccount(authID)
          this.emit('removedAccount', authID)
          return keyring.getAccounts()
        }
        return Promise.reject(
          new Error(`Keyring ${keyring.type} doesn't support account removal operations`),
        )
      })
      .then(accounts => {
        // Check if this was the last/only account
        if (accounts.length === 0) {
          return this.removeEmptyKeyrings()
        }
        return undefined
      })
      .then(this.persistAllKeyrings.bind(this))
      .then(this.updateMemStoreKeyrings.bind(this))
      .then(this.fullUpdate.bind(this))
      .catch(e => {
        return Promise.reject(e)
      })
  }
  /**
   * Get Accounts
   *
   * Returns the public authIDs of all current accounts
   * managed by all currently unlocked keyrings.
   *
   * @returns {Promise<Array<Buffer>>} The array of accounts.
   */
  public async getAccounts(): Promise<Array<Buffer>> {
    const keyrings = this.keyrings || []
    const authIDs = await Promise.all(keyrings.map((kr: any) => kr.getAccounts())).then(
      keyringArrays => {
        return keyringArrays.reduce((res: Array<Buffer>, arr: any) => {
          return res.concat(arr)
        }, [])
      },
    )
    return authIDs
  }
  /**
   * Persist All Keyrings
   *
   * Iterates the current `keyrings` array,
   * serializes each one into a serialized array,
   * encrypts that array with the provided `password`,
   * and persists that encrypted string to storage.
   *
   * @param {string} password - The keyring controller password.
   * @returns {Promise<boolean>} Resolves to true once keyrings are persisted.
   */
  public persistAllKeyrings(password: any = this.password) {
    if (typeof password !== 'string') {
      return Promise.reject(new Error('KeyringController - password is not a string'))
    }

    this.password = password

    return Promise.all(
      this.keyrings.map((keyring: any) => {
        return Promise.all([keyring.type, keyring.serialize()]).then(serializedKeyringArray => {
          // Label the output values on each serialized Keyring:
          return {
            type: serializedKeyringArray[0],
            data: serializedKeyringArray[1],
          }
        })
      }),
    )
      .then(serializedKeyrings => {
        return this.encryptor.encrypt(this.password, serializedKeyrings)
      })
      .then(encryptedString => {
        this.store.updateState({ vault: encryptedString })
        return true
      })
  }
  //
  // SIGNING METHODS
  //

  /**
   * Sign Fluree Transaction
   *
   * Signs an Fluree transaction object.
   *
   * @param {Object} flureeTx - The transaction to sign.
   * @param {Buffer} fromAuthID - The transaction 'from' authID.
   * @param {Object} opts - Signing options.
   * @returns {Promise<Object>} The signed transaction object.
   */
  public signTransaction(flureeTx: Transaction, fromAuthID: Buffer, opts = {}) {
    return this.getKeyringForAccount(fromAuthID).then(keyring => {
      return keyring.signTransaction(fromAuthID, flureeTx, opts)
    })
  }

  /**
   * Sign Fluree Query
   *
   * Signs an Fluree query object.
   *
   * @param {Object} flureeQuery - The query to sign.
   * @param {Buffer} fromAuthID - The query 'from' authID.
   * @param {Object} opts - Signing options.
   * @returns {Promise<Object>} The signed query object.
   */
  public signQuery(flureeQuery: Query, fromAuthID: Buffer, opts = {}) {
    return this.getKeyringForAccount(fromAuthID).then(keyring => {
      return keyring.signQuery(fromAuthID, flureeQuery, opts)
    })
  }

  /**
   * Sign Fluree Request
   *
   * Signs an Fluree request object.
   *
   * @param {Object} flureeRequest - The request to sign.
   * @param {Buffer} fromAuthID - The request 'from' authID.
   * @param {Object} opts - Signing options.
   * @returns {Promise<Object>} The signed request object.
   */
  public signRequest(flureeRequest: Request, fromAuthID: Buffer, opts = {}) {
    return this.getKeyringForAccount(fromAuthID).then(keyring => {
      return keyring.signRequest(fromAuthID, flureeRequest, opts)
    })
  }

  /**
   * Gets the app key authID for the given Fluree authID and origin.
   *
   * @param {Buffer} authID - The Fluree authID for the app key.
   * @param {string} origin - The origin for the app key.
   * @returns {Buffer} The app key authID.
   */
  public async getAppKeyAuthID(authID: Buffer, origin: string) {
    const keyring = await this.getKeyringForAccount(authID)
    return keyring.getAppKeyAuthID(authID, origin)
  }

  /**
   * Exports an app key private key for the given Fluree authID and origin.
   *
   * @param {Buffer} authID - The Fluree authID for the app key.
   * @param {string} origin - The origin for the app key.
   * @returns {Buffer} The app key private key.
   */
  public async exportAppKeyForAuthID(authID: Buffer, origin: string) {
    const keyring = await this.getKeyringForAccount(authID)
    if (!('exportAccount' in keyring)) {
      throw new Error(`The keyring for authID ${authID.toString()} does not support exporting.`)
    }
    return keyring.exportAccount(authID, { withAppKeyOrigin: origin })
  }
  /**
   * Restore Keyring
   *
   * Attempts to initialize a new keyring from the provided serialized payload.
   * On success, updates the memStore keyrings and returns the resulting
   * keyring instance.
   *
   * @param {Object} serialized - The serialized keyring.
   * @returns {Promise<Keyring>} The deserialized keyring.
   */
  public async restoreKeyring(serialized: Object) {
    const keyring = await this._restoreKeyring(serialized)
    await this.updateMemStoreKeyrings()
    return keyring
  }
  /**
   * Unlock Keyrings
   *
   * Attempts to unlock the persisted encrypted storage,
   * initializing the persisted keyrings to RAM.
   *
   * @param {string} password - The keyring controller password.
   * @returns {Promise<Array<Keyring>>} The keyrings.
   */
  public async unlockKeyrings(password: string) {
    const encryptedVault = this.store.getState().vault
    if (!encryptedVault) {
      throw new Error('Cannot unlock without a previous vault.')
    }

    await this.clearKeyrings()
    const vault = await this.encryptor.decrypt(password, encryptedVault)
    this.password = password
    await Promise.all(vault.map(this._restoreKeyring.bind(this)))
    await this.updateMemStoreKeyrings()
    return this.keyrings
  }

  /**
   * Get Keyring For Account
   *
   * Returns the currently initialized keyring that manages
   * the specified `authID` if one exists.
   *
   * @param {Buffer} authID - An account authID.
   * @returns {Promise<Keyring>} The keyring of the account, if it exists.
   */
  public getKeyringForAccount(authID: Buffer) {
    return Promise.all(
      this.keyrings.map((keyring: any) => {
        return Promise.all([keyring, keyring.getAccounts()])
      }),
    ).then(candidates => {
      const winners = candidates.filter((candidate: any) => {
        const accounts = candidate[1]
        return accounts.map((authIDaux: Buffer) => authIDaux.toString()).includes(authID.toString())
      }) as any
      if (winners && winners.length > 0) {
        return winners[0][0]
      }
      throw new Error('No keyring found for the requested account.')
    })
  }
  /**
   * Get Keyrings by Type
   *
   * Gets all keyrings of the given type.
   *
   * @param {string} type - The keyring types to retrieve.
   * @returns {Array<Keyring>} The keyrings.
   */
  public getKeyringsByType(type: string) {
    return this.keyrings.filter((keyring: any) => keyring.type === type)
  }

  //
  // PRIVATE METHODS
  //

  /**
   * Create First Key Tree
   *
   * - Clears the existing vault
   * - Creates a new vault
   * - Creates a random new HD Keyring with 1 account
   * - Makes that account the selected account
   * - Puts the current seed words into the state tree
   *
   * @returns {Promise<void>} - A promise that resovles if the operation was successful.
   */
  private createFirstKeyTree() {
    return this.clearKeyrings()
      .then(() => {
        return this.addNewKeyring('HD Key Tree', { numberOfAccounts: 1 })
      })
      .then((keyring: any) => {
        return keyring.getAccounts()
      })
      .then(([firstAccount]: Array<Buffer>) => {
        if (!firstAccount) {
          throw new Error('KeyringController - No account found on keychain.')
        }
        this.emit('newVault', firstAccount)
        return null
      })
  }

  /**
   * Restore Keyring Helper
   *
   * Attempts to initialize a new keyring from the provided serialized payload.
   * On success, returns the resulting keyring instance.
   *
   * @param {Object} serialized - The serialized keyring.
   * @returns {Promise<Keyring>} The deserialized keyring.
   */
  private async _restoreKeyring(serialized: any): Promise<any> {
    const { type, data } = serialized
    const Keyring = this.getKeyringClassForType(type)
    const keyring = new Keyring()
    await keyring.deserialize(data)
    // getAccounts also validates the accounts for some keyrings
    await keyring.getAccounts()
    this.keyrings.push(keyring)
    return keyring
  }

  /**
   * Get Keyring Class For Type
   *
   * Searches the current `keyringTypes` array
   * for a Keyring class whose unique `type` property
   * matches the provided `type`,
   * returning it if it exists.
   *
   * @param {string} type - The type whose class to get.
   * @returns {Keyring|undefined} The class, if it exists.
   */
  private getKeyringClassForType(type: string) {
    return this.keyringTypes.find((kr: any) => kr.type === type)
  }

  /**
   * Display For Keyring
   *
   * Is used for adding the current keyrings to the state object.
   * @param {Keyring} keyring
   * @returns {Promise<Object>} A keyring display object, with type and accounts properties.
   */
  private displayForKeyring(keyring: any) {
    return keyring.getAccounts().then((accounts: Array<Buffer>) => {
      return {
        type: keyring.type,
        accounts,
      }
    })
  }

  /**
   * Clear Keyrings
   *
   * Deallocates all currently managed keyrings and accounts.
   * Used before initializing a new vault.
   */
  /* eslint-disable require-await */
  private async clearKeyrings() {
    // clear keyrings from memory
    this.keyrings = []
    this.memStore.updateState({
      keyrings: [],
    })
  }

  /**
   * Update Memstore Keyrings
   *
   * Updates the in-memory keyrings, without persisting.
   */
  private async updateMemStoreKeyrings() {
    const keyrings = await Promise.all(this.keyrings.map(this.displayForKeyring))
    return this.memStore.updateState({ keyrings })
  }

  /**
   * Unlock Keyrings
   *
   * Unlocks the keyrings.
   *
   * @emits KeyringController#unlock
   */
  private setUnlocked() {
    this.memStore.updateState({ isUnlocked: true })
    this.emit('unlock')
  }
}

module.exports = KeyringController
