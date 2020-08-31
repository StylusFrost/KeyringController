/* tslint:disable no-invalid-this */
import assert = require('assert')
import Wallet from 'flureejs-wallet'
const sinon = require('sinon')
const mockEncryptor: any = require('./lib/mock-encryptor') // TODO: change to typscript
const configManagerGen = require('./lib/mock-config-manager') // TODO: change to typscript
import Query from 'flureejs-query'
import Request from 'flureejs-request'
import Transaction from 'flureejs-tx'

import KeyringController from '../src'

import { QueriessJsonEntry, RequestsJsonEntry, TxsJsonEntry } from './types'
const queryFixtures: QueriessJsonEntry[] = require('./queries.json')

const queries: Query[] = []
queryFixtures.slice(0, 3).forEach(function(query: any) {
  const pQ = new Query(query.raw)
  queries.push(pQ)
})

const requestFixtures: RequestsJsonEntry[] = require('./requests.json')
const requests: Request[] = []
requestFixtures.slice(0, 3).forEach(function(request: any) {
  const pQ = new Request(request.raw)
  requests.push(pQ)
})

const txFixtures: TxsJsonEntry[] = require('./txs.json')
const txs: Transaction[] = []
txFixtures.slice(0, 1).forEach(function(tx: any) {
  const pt = new Transaction(tx.raw)
  txs.push(pt)
})

const mockAuthID = Buffer.from('Tf5GLbfAVNJpkVvpAZEMdnafjagTrspnZPv')

let sandbox: any
describe('KeyringController', function() {
  let keyringController: KeyringController

  const password: string = 'password123'
  const seedWords: string =
    'puzzle seed penalty soldier say clay field arctic metal hen cage runway'
  const authIDs = [mockAuthID]

  beforeEach(async function() {
    sandbox = sinon.createSandbox()
    keyringController = new KeyringController({
      configManager: configManagerGen(),
      encryptor: mockEncryptor,
    })

    await keyringController.createNewVaultAndKeychain(password)
  })

  afterEach(function() {
    sandbox.restore()
  })

  describe('setLocked', function() {
    it('setLocked correctly sets lock state', async function() {
      assert.notDeepEqual(keyringController.keyrings, [], 'keyrings should not be empty')

      await keyringController.setLocked()

      assert.equal(keyringController.password, null, 'password should be null')
      assert.equal(
        keyringController.memStore.getState().isUnlocked,
        false,
        'isUnlocked should be false',
      )
      assert.deepEqual(keyringController.keyrings, [], 'keyrings should be empty')
    })
    it('emits "lock" event', async function() {
      const spy = sinon.spy()
      keyringController.on('lock', spy)

      await keyringController.setLocked()

      assert.ok(spy.calledOnce, 'lock event fired')
    })
  })

  describe('submitPassword', function() {
    it('should not create new keyrings when called in series', async function() {
      await keyringController.createNewVaultAndKeychain(password)
      await keyringController.persistAllKeyrings()
      assert.equal(keyringController.keyrings.length, 1, 'has one keyring')

      await keyringController.verifyPassword(password)

      await keyringController.submitPassword(`${password}a`)
      assert.equal(keyringController.keyrings.length, 1, 'has one keyring')

      await keyringController.submitPassword('')
      assert.equal(keyringController.keyrings.length, 1, 'has one keyring')
    })

    it('emits "unlock" event', async function() {
      await keyringController.setLocked()

      const spy = sinon.spy()
      keyringController.on('unlock', spy)

      await keyringController.submitPassword(password)
      assert.ok(spy.calledOnce, 'unlock event fired')
    })

    it('error verify password with no vault', async function() {
      keyringController.store.updateState({ vault: null })
      await keyringController
        .verifyPassword(password)
        .then(() => {
          assert(false, 'verify is ok')
        })
        .catch(() => {
          assert(true, 'no previous vault')
        })
    })
    it('error unlock with no vault', async function() {
      keyringController.store.updateState({ vault: null })
      await keyringController
        .unlockKeyrings(password)
        .then(() => {
          assert(false, 'verify is ok')
        })
        .catch(() => {
          assert(true, 'no previous vault')
        })
    })
  })

  describe('createNewVaultAndRestore', function() {
    it('should set a vault on the configManager', async function() {
      keyringController.store.updateState({ vault: null })
      assert(!keyringController.store.getState().vault, 'no previous vault')

      await keyringController.createNewVaultAndRestore(password, seedWords)
      const { vault } = keyringController.store.getState()
      assert(vault, 'vault created')
    })
  })
  describe('createNewVaultAndKeychain', function() {
    it('should set a vault on the configManager', async function() {
      keyringController.store.updateState({ vault: null })
      assert(!keyringController.store.getState().vault, 'no previous vault')

      await keyringController.createNewVaultAndKeychain(password)
      const { vault } = keyringController.store.getState()
      assert(vault, 'vault created')
    })

    it('should encrypt keyrings with the correct password each time they are persisted', async function() {
      keyringController.store.updateState({ vault: null })
      assert(!keyringController.store.getState().vault, 'no previous vault')

      await keyringController.createNewVaultAndKeychain(password)
      const { vault } = keyringController.store.getState()
      assert(vault, 'vault created')
      keyringController.encryptor.encrypt.args.forEach(([actualPassword]: Array<string>) => {
        assert.equal(actualPassword, password)
      })
    })
  })

  describe('addNewKeyring', function() {
    it('Simple Key Pair', async function() {
      const privateKey = Buffer.from(
        '6a5f415f49986006815ae7887016275aac8ffb239f9a2fa7172300578582b6c2',
        'hex',
      )
      const previousAccounts = await keyringController.getAccounts()
      const keyring = await keyringController.addNewKeyring('Simple Key Pair', [privateKey])
      const keyringAccounts = await keyring.getAccounts()
      const expectedKeyringAccounts = [
        Buffer.from(
          '5466477641644b48326e526456347a503479427a346b4a325239577a59484465324556',
          'hex',
        ),
      ]
      assert.equal(
        Buffer.compare(keyringAccounts[0], expectedKeyringAccounts[0]) === 0,
        true,
        'keyringAccounts match expectation',
      )
      const allAccounts = await keyringController.getAccounts()
      const expectedAllAccounts = previousAccounts.concat(expectedKeyringAccounts)
      assert.equal(
        Buffer.compare(allAccounts[0], expectedAllAccounts[0]) === 0,
        true,
        'keyringAccounts match expectation',
      )
      assert.equal(
        Buffer.compare(allAccounts[1], expectedAllAccounts[1]) === 0,
        true,
        'keyringAccounts match expectation',
      )
    })
  })

  describe('restoreKeyring', function() {
    it(`should pass a keyring's serialized data back to the correct type.`, async function() {
      const mockSerialized = {
        type: 'HD Key Tree',
        data: {
          mnemonic: seedWords,
          numberOfAccounts: 1,
        },
      }

      const keyring = await keyringController.restoreKeyring(mockSerialized)
      assert.equal(keyring.wallets.length, 1, 'one wallet restored')
      const accounts = await keyring.getAccounts()
      assert.equal(Buffer.compare(accounts[0], authIDs[0]) === 0, true)
    })
  })

  describe('getAccounts', function() {
    it('returns the result of getAccounts for each keyring', async function() {
      keyringController.keyrings = [
        {
          getAccounts() {
            return Promise.resolve([1, 2, 3])
          },
        },
        {
          getAccounts() {
            return Promise.resolve([4, 5, 6])
          },
        },
      ]

      const result = await keyringController.getAccounts()
      assert.deepEqual(result, [1, 2, 3, 4, 5, 6])
    })
  })

  describe('addNewAccount', function() {
    it('add another account from the corresponding keyring', async function() {
      const account = {
        privateKey: Buffer.from(
          '6a5f415f49986006815ae7887016275aac8ffb239f9a2fa7172300578582b6c2',
          'hex',
        ),
        authID: Buffer.from(
          '5466477641644b48326e526456347a503479427a346b4a325239577a59484465324556',
          'hex',
        ),
      }
      const accountsBeforeAdding = await keyringController.getAccounts()

      // Add a new keyring with one account
      await keyringController.addNewKeyring('Simple Key Pair', [account.privateKey])

      // Add another account
      const keyring = await keyringController.getKeyringForAccount(account.authID)
      keyringController.addNewAccount(keyring)

      // fetch accounts after removal
      const result = await keyringController.getAccounts()
      assert.equal(Buffer.compare(result[0], accountsBeforeAdding[0]) === 0, true)
    })
  })

  describe('error not exists account', function() {
    it('get Keyring that accound not exists', async function() {
      const account = {
        privateKey: Buffer.from(
          '6a5f415f49986006815ae7887016275aac8ffb239f9a2fa7172300578582b6c2',
          'hex',
        ),
        authID: Buffer.from(
          '5466477641644b48326e526456347a503479427a346b4a325239577a59484465324111',
          'hex',
        ),
      }

      // Add a new keyring with one account
      await keyringController.addNewKeyring('Simple Key Pair', [account.privateKey])

      // Add another account
      await keyringController
        .getKeyringForAccount(account.authID)
        .then(() => {
          assert(false, 'account exists')
        })
        .catch(() => {
          assert(true, 'no previous vault')
        })
    })
  })

  describe('removeAccount', function() {
    it('removes an account from the corresponding keyring', async function() {
      const account = {
        privateKey: Buffer.from(
          '6a5f415f49986006815ae7887016275aac8ffb239f9a2fa7172300578582b6c2',
          'hex',
        ),
        authID: Buffer.from(
          '5466477641644b48326e526456347a503479427a346b4a325239577a59484465324556',
          'hex',
        ),
      }

      const accountsBeforeAdding = await keyringController.getAccounts()

      // Add a new keyring with one account
      await keyringController.addNewKeyring('Simple Key Pair', [account.privateKey])

      // remove that account that we just added
      await keyringController.removeAccount(account.authID)

      // fetch accounts after removal
      const result = await keyringController.getAccounts()
      assert.equal(Buffer.compare(result[0], accountsBeforeAdding[0]) === 0, true)
    })

    it('removes the keyring if there are no accounts after removal', async function() {
      const account = {
        privateKey: Buffer.from(
          '6a5f415f49986006815ae7887016275aac8ffb239f9a2fa7172300578582b6c2',
          'hex',
        ),
        authID: Buffer.from(
          '5466477641644b48326e526456347a503479427a346b4a325239577a59484465324556',
          'hex',
        ),
      }

      // Add a new keyring with one account
      await keyringController.addNewKeyring('Simple Key Pair', [account.privateKey])

      // We should have 2 keyrings
      assert.equal(keyringController.keyrings.length, 2)

      // remove that account that we just added
      await keyringController.removeAccount(account.authID)

      // Check that the previous keyring with only one account
      // was also removed after removing the account
      assert.equal(keyringController.keyrings.length, 1)
    })
  })

  describe('unlockKeyrings', function() {
    it('returns the list of keyrings', async function() {
      await keyringController.setLocked()
      const keyrings = await keyringController.unlockKeyrings(password)
      assert.notStrictEqual(keyrings.length, 0)
      keyrings.forEach(keyring => {
        assert.strictEqual(keyring.wallets.length, 1)
      })
    })
  })

  describe('getAppKeyAuthID', function() {
    it('returns the expected app key authID', async function() {
      const privateKey = Buffer.from(
        '6a5f415f49986006815ae7887016275aac8ffb239f9a2fa7172300578582b6c2',
        'hex',
      )
      const authID = Buffer.from(
        '5466477641644b48326e526456347a503479427a346b4a325239577a59484465324556',
        'hex',
      )

      const keyring = await keyringController.addNewKeyring('Simple Key Pair', [privateKey])
      keyring.getAppKeyAuthID = sinon.spy()
      /* eslint-disable-next-line require-atomic-updates */
      keyringController.getKeyringForAccount = sinon.stub().returns(Promise.resolve(keyring))

      await keyringController.getAppKeyAuthID(authID, 'someapp.origin.io')

      sinon.assert.calledOnce(keyringController.getKeyringForAccount)
      // TODO: sinon is not working
      //assert.equal(keyringController.getKeyringForAccount.getCall(0).args[0], authID)
      sinon.assert.calledOnce(keyring.getAppKeyAuthID)
      assert.deepEqual(keyring.getAppKeyAuthID.getCall(0).args, [authID, 'someapp.origin.io'])
    })
  })

  describe('exportAccount', function() {
    it('returns a unique key', async function() {
      const privateKey = Buffer.from(
        '6a5f415f49986006815ae7887016275aac8ffb239f9a2fa7172300578582b6c2',
        'hex',
      )
      const authID = Buffer.from(
        '5466477641644b48326e526456347a503479427a346b4a325239577a59484465324556',
        'hex',
      )

      await keyringController.addNewKeyring('Simple Key Pair', [privateKey])
      const pKey = await keyringController.exportAccount(authID)

      const wallet = Wallet.fromPrivateKey(pKey)
      const recoveredAuthID = wallet.getAuthID()

      assert.equal(Buffer.compare(recoveredAuthID, authID) === 0, true)
    })
  })

  describe('exportAppKeyForAuthID', function() {
    it('returns a unique key', async function() {
      const privateKey = Buffer.from(
        '6a5f415f49986006815ae7887016275aac8ffb239f9a2fa7172300578582b6c2',
        'hex',
      )
      const authID = Buffer.from(
        '5466477641644b48326e526456347a503479427a346b4a325239577a59484465324556',
        'hex',
      )

      await keyringController.addNewKeyring('Simple Key Pair', [privateKey])
      const eappKeyAuthID = await keyringController.getAppKeyAuthID(authID, 'someapp.origin.io')

      const privateAppKey = await keyringController.exportAppKeyForAuthID(
        authID,
        'someapp.origin.io',
      )

      const wallet = Wallet.fromPrivateKey(privateAppKey)
      const recoveredAuthID = wallet.getAuthID()

      assert.equal(Buffer.compare(recoveredAuthID, eappKeyAuthID) === 0, true)
      assert.notEqual(Buffer.compare(privateAppKey, privateKey) === 0, true)
    })
  })
  describe('Signing', function() {
    it('should sign query', async function() {
      await keyringController.addNewKeyring('Simple Key Pair', [
        Buffer.from(queryFixtures[0].privateKey, 'hex'),
      ])
      await keyringController.signQuery(
        queries[0],
        Buffer.from('Tf8ovHdgnDZXrMzqELpa1xs1cfdhJie3Pwa'),
      )
      assert.equal(queries[0].verifySignature(), true)
    })
    it('should sign request', async function() {
      await keyringController.addNewKeyring('Simple Key Pair', [
        Buffer.from(requestFixtures[0].privateKey, 'hex'),
      ])
      await keyringController.signRequest(
        requests[0],
        Buffer.from('Tf8ovHdgnDZXrMzqELpa1xs1cfdhJie3Pwa'),
      )
      assert.equal(requests[0].verifySignature(), true)
    })
    it('should sign transaction', async function() {
      await keyringController.addNewKeyring('Simple Key Pair', [
        Buffer.from(txFixtures[0].privateKey, 'hex'),
      ])
      await keyringController.signTransaction(
        txs[0],
        Buffer.from('Tf8ovHdgnDZXrMzqELpa1xs1cfdhJie3Pwa'),
      )
      assert.equal(txs[0].verifySignature(), true)
    })
  })
})
