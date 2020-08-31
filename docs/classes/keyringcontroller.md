[fluree-keyring-controller - v0.1.0](../README.md) > [KeyringController](../classes/keyringcontroller.md)

# Class: KeyringController

## Hierarchy

`EventEmitter`

**↳ KeyringController**

## Index

### Constructors

- [constructor](keyringcontroller.md#constructor)

### Properties

- [encryptor](keyringcontroller.md#encryptor)
- [initState](keyringcontroller.md#initstate)
- [keyringTypes](keyringcontroller.md#keyringtypes)
- [keyrings](keyringcontroller.md#keyrings)
- [memStore](keyringcontroller.md#memstore)
- [password](keyringcontroller.md#password)
- [store](keyringcontroller.md#store)
- [defaultMaxListeners](keyringcontroller.md#defaultmaxlisteners)

### Methods

- [\_restoreKeyring](keyringcontroller.md#_restorekeyring)
- [addListener](keyringcontroller.md#addlistener)
- [addNewAccount](keyringcontroller.md#addnewaccount)
- [addNewKeyring](keyringcontroller.md#addnewkeyring)
- [checkForDuplicate](keyringcontroller.md#checkforduplicate)
- [clearKeyrings](keyringcontroller.md#clearkeyrings)
- [createFirstKeyTree](keyringcontroller.md#createfirstkeytree)
- [createNewVaultAndKeychain](keyringcontroller.md#createnewvaultandkeychain)
- [createNewVaultAndRestore](keyringcontroller.md#createnewvaultandrestore)
- [displayForKeyring](keyringcontroller.md#displayforkeyring)
- [emit](keyringcontroller.md#emit)
- [eventNames](keyringcontroller.md#eventnames)
- [exportAccount](keyringcontroller.md#exportaccount)
- [exportAppKeyForAuthID](keyringcontroller.md#exportappkeyforauthid)
- [fullUpdate](keyringcontroller.md#fullupdate)
- [getAccounts](keyringcontroller.md#getaccounts)
- [getAppKeyAuthID](keyringcontroller.md#getappkeyauthid)
- [getKeyringClassForType](keyringcontroller.md#getkeyringclassfortype)
- [getKeyringForAccount](keyringcontroller.md#getkeyringforaccount)
- [getKeyringsByType](keyringcontroller.md#getkeyringsbytype)
- [getMaxListeners](keyringcontroller.md#getmaxlisteners)
- [listenerCount](keyringcontroller.md#listenercount)
- [listeners](keyringcontroller.md#listeners)
- [off](keyringcontroller.md#off)
- [on](keyringcontroller.md#on)
- [once](keyringcontroller.md#once)
- [persistAllKeyrings](keyringcontroller.md#persistallkeyrings)
- [prependListener](keyringcontroller.md#prependlistener)
- [prependOnceListener](keyringcontroller.md#prependoncelistener)
- [rawListeners](keyringcontroller.md#rawlisteners)
- [removeAccount](keyringcontroller.md#removeaccount)
- [removeAllListeners](keyringcontroller.md#removealllisteners)
- [removeEmptyKeyrings](keyringcontroller.md#removeemptykeyrings)
- [removeListener](keyringcontroller.md#removelistener)
- [restoreKeyring](keyringcontroller.md#restorekeyring)
- [setLocked](keyringcontroller.md#setlocked)
- [setMaxListeners](keyringcontroller.md#setmaxlisteners)
- [setUnlocked](keyringcontroller.md#setunlocked)
- [signQuery](keyringcontroller.md#signquery)
- [signRequest](keyringcontroller.md#signrequest)
- [signTransaction](keyringcontroller.md#signtransaction)
- [submitPassword](keyringcontroller.md#submitpassword)
- [unlockKeyrings](keyringcontroller.md#unlockkeyrings)
- [updateMemStoreKeyrings](keyringcontroller.md#updatememstorekeyrings)
- [verifyPassword](keyringcontroller.md#verifypassword)
- [listenerCount](keyringcontroller.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

### constructor

⊕ **new KeyringController**(opts: _`any`_): [KeyringController](keyringcontroller.md)

_Defined in src/index.ts:20_

**Parameters:**

| Name            | Type  |
| --------------- | ----- |
| `Optional` opts | `any` |

**Returns:** [KeyringController](keyringcontroller.md)

---

## Properties

<a id="encryptor"></a>

### encryptor

**● encryptor**: _`any`_

_Defined in src/index.ts:16_

---

<a id="initstate"></a>

### initState

**● initState**: _`Object`_

_Defined in src/index.ts:20_

---

<a id="keyringtypes"></a>

### `<Private>` keyringTypes

**● keyringTypes**: _`any`[]_

_Defined in src/index.ts:18_

---

<a id="keyrings"></a>

### keyrings

**● keyrings**: _`Array`<`any`>_

_Defined in src/index.ts:17_

---

<a id="memstore"></a>

### memStore

**● memStore**: _`any`_

_Defined in src/index.ts:15_

---

<a id="password"></a>

### password

**● password**: _`string` \| `undefined`_

_Defined in src/index.ts:19_

---

<a id="store"></a>

### store

**● store**: _`any`_

_Defined in src/index.ts:14_

---

<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: _`number`_

_Inherited from EventEmitter.defaultMaxListeners_

_Defined in node_modules/@types/node/events.d.ts:30_

---

## Methods

<a id="_restorekeyring"></a>

### `<Private>` \_restoreKeyring

▸ **\_restoreKeyring**(serialized: _`any`_): `Promise`<`any`>

_Defined in src/index.ts:590_

**Parameters:**

| Name       | Type  | Description             |
| ---------- | ----- | ----------------------- |
| serialized | `any` | The serialized keyring. |

**Returns:** `Promise`<`any`>
The deserialized keyring.

---

<a id="addlistener"></a>

### addListener

▸ **addListener**(event: _`string` \| `symbol`_, listener: _`function`_): `this`

_Inherited from EventEmitter.addListener_

_Overrides EventEmitter.addListener_

_Defined in node_modules/@types/node/events.d.ts:32_

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| event    | `string` \| `symbol` |
| listener | `function`           |

**Returns:** `this`

---

<a id="addnewaccount"></a>

### addNewAccount

▸ **addNewAccount**(selectedKeyring: _`any`_): `any`

_Defined in src/index.ts:269_

**Parameters:**

| Name            | Type  | Description                     |
| --------------- | ----- | ------------------------------- |
| selectedKeyring | `any` | The currently selected keyring. |

**Returns:** `any`
A Promise that resolves to the state.

---

<a id="addnewkeyring"></a>

### addNewKeyring

▸ **addNewKeyring**(type: _`string`_, opts: _`any`_): `any`

_Defined in src/index.ts:189_

**Parameters:**

| Name            | Type     | Description                              |
| --------------- | -------- | ---------------------------------------- |
| type            | `string` | The type of keyring to add.              |
| `Optional` opts | `any`    | The constructor options for the keyring. |

**Returns:** `any`
The new keyring.

---

<a id="checkforduplicate"></a>

### checkForDuplicate

▸ **checkForDuplicate**(type: _`string`_, newAccountArray: _`Array`<`Buffer`>_): `Promise`<`Buffer`[]>

_Defined in src/index.ts:242_

**Parameters:**

| Name            | Type              | Description                     |
| --------------- | ----------------- | ------------------------------- |
| type            | `string`          | The key pair type to check for. |
| newAccountArray | `Array`<`Buffer`> | Array of new accounts.          |

**Returns:** `Promise`<`Buffer`[]>
The account, if no duplicate is found.

---

<a id="clearkeyrings"></a>

### `<Private>` clearKeyrings

▸ **clearKeyrings**(): `Promise`<`void`>

_Defined in src/index.ts:639_

**Returns:** `Promise`<`void`>

---

<a id="createfirstkeytree"></a>

### `<Private>` createFirstKeyTree

▸ **createFirstKeyTree**(): `Promise`<`null`>

_Defined in src/index.ts:564_

**Returns:** `Promise`<`null`>

- A promise that resovles if the operation was successful.

---

<a id="createnewvaultandkeychain"></a>

### createNewVaultAndKeychain

▸ **createNewVaultAndKeychain**(password: _`string`_): `Promise`<`any`>

_Defined in src/index.ts:70_

**Parameters:**

| Name     | Type     | Description                             |
| -------- | -------- | --------------------------------------- |
| password | `string` | The password to encrypt the vault with. |

**Returns:** `Promise`<`any`>
A Promise that resolves to the state.

---

<a id="createnewvaultandrestore"></a>

### createNewVaultAndRestore

▸ **createNewVaultAndRestore**(password: _`string`_, seed: _`string`_): `Promise`<`any`>

_Defined in src/index.ts:90_

**Parameters:**

| Name     | Type     | Description                            |
| -------- | -------- | -------------------------------------- |
| password | `string` | The password to encrypt the vault with |
| seed     | `string` | The BIP44-compliant seed phrase.       |

**Returns:** `Promise`<`any`>
A Promise that resolves to the state.

---

<a id="displayforkeyring"></a>

### `<Private>` displayForKeyring

▸ **displayForKeyring**(keyring: _`any`_): `any`

_Defined in src/index.ts:623_

**Parameters:**

| Name    | Type  | Description |
| ------- | ----- | ----------- |
| keyring | `any` | \-          |

**Returns:** `any`
A keyring display object, with type and accounts properties.

---

<a id="emit"></a>

### emit

▸ **emit**(event: _`string` \| `symbol`_, args: _`any`[]_): `boolean`

_Inherited from EventEmitter.emit_

_Overrides EventEmitter.emit_

_Defined in node_modules/@types/node/events.d.ts:44_

**Parameters:**

| Name        | Type                 |
| ----------- | -------------------- |
| event       | `string` \| `symbol` |
| `Rest` args | `any`[]              |

**Returns:** `boolean`

---

<a id="eventnames"></a>

### eventNames

▸ **eventNames**(): `Array`<`string` \| `symbol`>

_Inherited from EventEmitter.eventNames_

_Overrides EventEmitter.eventNames_

_Defined in node_modules/@types/node/events.d.ts:45_

**Returns:** `Array`<`string` \| `symbol`>

---

<a id="exportaccount"></a>

### exportAccount

▸ **exportAccount**(authID: _`Buffer`_): `Promise`<`any`>

_Defined in src/index.ts:293_

**Parameters:**

| Name   | Type     | Description                          |
| ------ | -------- | ------------------------------------ |
| authID | `Buffer` | The authID of the account to export. |

**Returns:** `Promise`<`any`>
The private key of the account.

---

<a id="exportappkeyforauthid"></a>

### exportAppKeyForAuthID

▸ **exportAppKeyForAuthID**(authID: _`Buffer`_, origin: _`string`_): `Promise`<`any`>

_Defined in src/index.ts:467_

**Parameters:**

| Name   | Type     | Description                        |
| ------ | -------- | ---------------------------------- |
| authID | `Buffer` | The Fluree authID for the app key. |
| origin | `string` | The origin for the app key.        |

**Returns:** `Promise`<`any`>
The app key private key.

---

<a id="fullupdate"></a>

### fullUpdate

▸ **fullUpdate**(): `any`

_Defined in src/index.ts:53_

**Returns:** `any`
The controller state.

---

<a id="getaccounts"></a>

### getAccounts

▸ **getAccounts**(): `Promise`<`Array`<`Buffer`>>

_Defined in src/index.ts:348_

**Returns:** `Promise`<`Array`<`Buffer`>>
The array of accounts.

---

<a id="getappkeyauthid"></a>

### getAppKeyAuthID

▸ **getAppKeyAuthID**(authID: _`Buffer`_, origin: _`string`_): `Promise`<`any`>

_Defined in src/index.ts:455_

**Parameters:**

| Name   | Type     | Description                        |
| ------ | -------- | ---------------------------------- |
| authID | `Buffer` | The Fluree authID for the app key. |
| origin | `string` | The origin for the app key.        |

**Returns:** `Promise`<`any`>
The app key authID.

---

<a id="getkeyringclassfortype"></a>

### `<Private>` getKeyringClassForType

▸ **getKeyringClassForType**(type: _`string`_): `any`

_Defined in src/index.ts:612_

**Parameters:**

| Name | Type     | Description                  |
| ---- | -------- | ---------------------------- |
| type | `string` | The type whose class to get. |

**Returns:** `any`
The class, if it exists.

---

<a id="getkeyringforaccount"></a>

### getKeyringForAccount

▸ **getKeyringForAccount**(authID: _`Buffer`_): `Promise`<`any`>

_Defined in src/index.ts:521_

**Parameters:**

| Name   | Type     | Description        |
| ------ | -------- | ------------------ |
| authID | `Buffer` | An account authID. |

**Returns:** `Promise`<`any`>
The keyring of the account, if it exists.

---

<a id="getkeyringsbytype"></a>

### getKeyringsByType

▸ **getKeyringsByType**(type: _`string`_): `any`[]

_Defined in src/index.ts:545_

**Parameters:**

| Name | Type     | Description                    |
| ---- | -------- | ------------------------------ |
| type | `string` | The keyring types to retrieve. |

**Returns:** `any`[]
The keyrings.

---

<a id="getmaxlisteners"></a>

### getMaxListeners

▸ **getMaxListeners**(): `number`

_Inherited from EventEmitter.getMaxListeners_

_Overrides EventEmitter.getMaxListeners_

_Defined in node_modules/@types/node/events.d.ts:41_

**Returns:** `number`

---

<a id="listenercount"></a>

### listenerCount

▸ **listenerCount**(type: _`string` \| `symbol`_): `number`

_Inherited from EventEmitter.listenerCount_

_Overrides EventEmitter.listenerCount_

_Defined in node_modules/@types/node/events.d.ts:46_

**Parameters:**

| Name | Type                 |
| ---- | -------------------- |
| type | `string` \| `symbol` |

**Returns:** `number`

---

<a id="listeners"></a>

### listeners

▸ **listeners**(event: _`string` \| `symbol`_): `Function`[]

_Inherited from EventEmitter.listeners_

_Overrides EventEmitter.listeners_

_Defined in node_modules/@types/node/events.d.ts:42_

**Parameters:**

| Name  | Type                 |
| ----- | -------------------- |
| event | `string` \| `symbol` |

**Returns:** `Function`[]

---

<a id="off"></a>

### off

▸ **off**(event: _`string` \| `symbol`_, listener: _`function`_): `this`

_Inherited from EventEmitter.off_

_Overrides EventEmitter.off_

_Defined in node_modules/@types/node/events.d.ts:38_

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| event    | `string` \| `symbol` |
| listener | `function`           |

**Returns:** `this`

---

<a id="on"></a>

### on

▸ **on**(event: _`string` \| `symbol`_, listener: _`function`_): `this`

_Inherited from EventEmitter.on_

_Overrides EventEmitter.on_

_Defined in node_modules/@types/node/events.d.ts:33_

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| event    | `string` \| `symbol` |
| listener | `function`           |

**Returns:** `this`

---

<a id="once"></a>

### once

▸ **once**(event: _`string` \| `symbol`_, listener: _`function`_): `this`

_Inherited from EventEmitter.once_

_Overrides EventEmitter.once_

_Defined in node_modules/@types/node/events.d.ts:34_

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| event    | `string` \| `symbol` |
| listener | `function`           |

**Returns:** `this`

---

<a id="persistallkeyrings"></a>

### persistAllKeyrings

▸ **persistAllKeyrings**(password?: _`any`_): `Promise`<`boolean`>

_Defined in src/index.ts:370_

**Parameters:**

| Name                     | Type  | Default value | Description                      |
| ------------------------ | ----- | ------------- | -------------------------------- |
| `Default value` password | `any` | this.password | The keyring controller password. |

**Returns:** `Promise`<`boolean`>
Resolves to true once keyrings are persisted.

---

<a id="prependlistener"></a>

### prependListener

▸ **prependListener**(event: _`string` \| `symbol`_, listener: _`function`_): `this`

_Inherited from EventEmitter.prependListener_

_Overrides EventEmitter.prependListener_

_Defined in node_modules/@types/node/events.d.ts:35_

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| event    | `string` \| `symbol` |
| listener | `function`           |

**Returns:** `this`

---

<a id="prependoncelistener"></a>

### prependOnceListener

▸ **prependOnceListener**(event: _`string` \| `symbol`_, listener: _`function`_): `this`

_Inherited from EventEmitter.prependOnceListener_

_Overrides EventEmitter.prependOnceListener_

_Defined in node_modules/@types/node/events.d.ts:36_

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| event    | `string` \| `symbol` |
| listener | `function`           |

**Returns:** `this`

---

<a id="rawlisteners"></a>

### rawListeners

▸ **rawListeners**(event: _`string` \| `symbol`_): `Function`[]

_Inherited from EventEmitter.rawListeners_

_Overrides EventEmitter.rawListeners_

_Defined in node_modules/@types/node/events.d.ts:43_

**Parameters:**

| Name  | Type                 |
| ----- | -------------------- |
| event | `string` \| `symbol` |

**Returns:** `Function`[]

---

<a id="removeaccount"></a>

### removeAccount

▸ **removeAccount**(authID: _`Buffer`_): `Promise`<`any`>

_Defined in src/index.ts:313_

**Parameters:**

| Name   | Type     | Description                          |
| ------ | -------- | ------------------------------------ |
| authID | `Buffer` | The authID of the account to remove. |

**Returns:** `Promise`<`any`>
A Promise that resolves if the operation was successful.

---

<a id="removealllisteners"></a>

### removeAllListeners

▸ **removeAllListeners**(event: _`string` \| `symbol`_): `this`

_Inherited from EventEmitter.removeAllListeners_

_Overrides EventEmitter.removeAllListeners_

_Defined in node_modules/@types/node/events.d.ts:39_

**Parameters:**

| Name             | Type                 |
| ---------------- | -------------------- |
| `Optional` event | `string` \| `symbol` |

**Returns:** `this`

---

<a id="removeemptykeyrings"></a>

### removeEmptyKeyrings

▸ **removeEmptyKeyrings**(): `Promise`<`void`>

_Defined in src/index.ts:214_

**Returns:** `Promise`<`void`>

---

<a id="removelistener"></a>

### removeListener

▸ **removeListener**(event: _`string` \| `symbol`_, listener: _`function`_): `this`

_Inherited from EventEmitter.removeListener_

_Overrides EventEmitter.removeListener_

_Defined in node_modules/@types/node/events.d.ts:37_

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| event    | `string` \| `symbol` |
| listener | `function`           |

**Returns:** `this`

---

<a id="restorekeyring"></a>

### restoreKeyring

▸ **restoreKeyring**(serialized: _`Object`_): `Promise`<`any`>

_Defined in src/index.ts:484_

**Parameters:**

| Name       | Type     | Description             |
| ---------- | -------- | ----------------------- |
| serialized | `Object` | The serialized keyring. |

**Returns:** `Promise`<`any`>
The deserialized keyring.

---

<a id="setlocked"></a>

### setLocked

▸ **setLocked**(): `Promise`<`any`>

_Defined in src/index.ts:130_

**Returns:** `Promise`<`any`>
A Promise that resolves to the state.

---

<a id="setmaxlisteners"></a>

### setMaxListeners

▸ **setMaxListeners**(n: _`number`_): `this`

_Inherited from EventEmitter.setMaxListeners_

_Overrides EventEmitter.setMaxListeners_

_Defined in node_modules/@types/node/events.d.ts:40_

**Parameters:**

| Name | Type     |
| ---- | -------- |
| n    | `number` |

**Returns:** `this`

---

<a id="setunlocked"></a>

### `<Private>` setUnlocked

▸ **setUnlocked**(): `void`

_Defined in src/index.ts:664_

**Returns:** `void`

---

<a id="signquery"></a>

### signQuery

▸ **signQuery**(flureeQuery: _`Query`_, fromAuthID: _`Buffer`_, opts?: _`object`_): `Promise`<`any`>

_Defined in src/index.ts:426_

**Parameters:**

| Name                 | Type     | Default value | Description              |
| -------------------- | -------- | ------------- | ------------------------ |
| flureeQuery          | `Query`  | -             | The query to sign.       |
| fromAuthID           | `Buffer` | -             | The query 'from' authID. |
| `Default value` opts | `object` | {}            | Signing options.         |

**Returns:** `Promise`<`any`>
The signed query object.

---

<a id="signrequest"></a>

### signRequest

▸ **signRequest**(flureeRequest: _`Request`_, fromAuthID: _`Buffer`_, opts?: _`object`_): `Promise`<`any`>

_Defined in src/index.ts:442_

**Parameters:**

| Name                 | Type      | Default value | Description                |
| -------------------- | --------- | ------------- | -------------------------- |
| flureeRequest        | `Request` | -             | The request to sign.       |
| fromAuthID           | `Buffer`  | -             | The request 'from' authID. |
| `Default value` opts | `object`  | {}            | Signing options.           |

**Returns:** `Promise`<`any`>
The signed request object.

---

<a id="signtransaction"></a>

### signTransaction

▸ **signTransaction**(flureeTx: _`Transaction`_, fromAuthID: _`Buffer`_, opts?: _`object`_): `Promise`<`any`>

_Defined in src/index.ts:410_

**Parameters:**

| Name                 | Type          | Default value | Description                    |
| -------------------- | ------------- | ------------- | ------------------------------ |
| flureeTx             | `Transaction` | -             | The transaction to sign.       |
| fromAuthID           | `Buffer`      | -             | The transaction 'from' authID. |
| `Default value` opts | `object`      | {}            | Signing options.               |

**Returns:** `Promise`<`any`>
The signed transaction object.

---

<a id="submitpassword"></a>

### submitPassword

▸ **submitPassword**(password: _`string`_): `Promise`<`any`>

_Defined in src/index.ts:152_

**Parameters:**

| Name     | Type     | Description                      |
| -------- | -------- | -------------------------------- |
| password | `string` | The keyring controller password. |

**Returns:** `Promise`<`any`>
A Promise that resolves to the state.

---

<a id="unlockkeyrings"></a>

### unlockKeyrings

▸ **unlockKeyrings**(password: _`string`_): `Promise`<`any`[]>

_Defined in src/index.ts:498_

**Parameters:**

| Name     | Type     | Description                      |
| -------- | -------- | -------------------------------- |
| password | `string` | The keyring controller password. |

**Returns:** `Promise`<`any`[]>
The keyrings.

---

<a id="updatememstorekeyrings"></a>

### `<Private>` updateMemStoreKeyrings

▸ **updateMemStoreKeyrings**(): `Promise`<`any`>

_Defined in src/index.ts:652_

**Returns:** `Promise`<`any`>

---

<a id="verifypassword"></a>

### verifyPassword

▸ **verifyPassword**(password: _`string`_): `Promise`<`void`>

_Defined in src/index.ts:168_

**Parameters:**

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| password | `string` |             |

**Returns:** `Promise`<`void`>

---

<a id="listenercount-1"></a>

### `<Static>` listenerCount

▸ **listenerCount**(emitter: _`EventEmitter`_, event: _`string` \| `symbol`_): `number`

_Inherited from EventEmitter.listenerCount_

_Defined in node_modules/@types/node/events.d.ts:29_

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| emitter | `EventEmitter`       |
| event   | `string` \| `symbol` |

**Returns:** `number`

---
