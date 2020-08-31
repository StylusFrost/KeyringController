/*
 * It exists mostly to allow the creation of
 * convenience methods to access and persist
 * particular portions of the state.
 */
module.exports = ConfigManager
function ConfigManager (opts) {
  // ConfigManager is observable and will emit updates
  this._subs = []
  this.store = opts.store
}

ConfigManager.prototype.setConfig = function (config) {
  const data = this.getData()
  data.config = config
  this.setData(data)
  this._emitUpdates(config)
}

ConfigManager.prototype.getConfig = function () {
  const data = this.getData()
  return data.config
}

ConfigManager.prototype.setData = function (data) {
  this.store.putState(data)
}

ConfigManager.prototype.getData = function () {
  return this.store.getState()
}

ConfigManager.prototype.setWallet = function (wallet) {
  const data = this.getData()
  data.wallet = wallet
  this.setData(data)
}

ConfigManager.prototype.setVault = function (encryptedString) {
  const data = this.getData()
  data.vault = encryptedString
  this.setData(data)
}

ConfigManager.prototype.getVault = function () {
  const data = this.getData()
  return data.vault
}


ConfigManager.prototype.getSelectedAccount = function () {
  const config = this.getConfig()
  return config.selectedAccount
}

ConfigManager.prototype.setSelectedAccount = function (authID) {
  const config = this.getConfig()
  config.selectedAccount = authID
  this.setConfig(config)
}

ConfigManager.prototype.getWallet = function () {
  return this.getData().wallet
}

// Takes a boolean
ConfigManager.prototype.setShowSeedWords = function (should) {
  const data = this.getData()
  data.showSeedWords = should
  this.setData(data)
}


ConfigManager.prototype.getShouldShowSeedWords = function () {
  const data = this.getData()
  return data.showSeedWords
}

ConfigManager.prototype.setSeedWords = function (words) {
  const data = this.getData()
  data.seedWords = words
  this.setData(data)
}

ConfigManager.prototype.getSeedWords = function () {
  const data = this.getData()
  return data.seedWords
}


//
// Tx
//

ConfigManager.prototype.getTxList = function () {
  const data = this.getData()
  if (data.transactions !== undefined) {
    return data.transactions
  }
  return []

}

ConfigManager.prototype.setTxList = function (txList) {
  const data = this.getData()
  data.transactions = txList
  this.setData(data)
}

//
// Query
//

ConfigManager.prototype.getQueryList = function () {
  const data = this.getData()
  if (data.queries !== undefined) {
    return data.queries
  }
  return []

}

ConfigManager.prototype.setQueryList = function (queryList) {
  const data = this.getData()
  data.queries = queryList
  this.setData(data)
}

//
// Request
//

ConfigManager.prototype.getRequestList = function () {
  const data = this.getData()
  if (data.requests !== undefined) {
    return data.requests
  }
  return []

}

ConfigManager.prototype.setQueryList = function (requestList) {
  const data = this.getData()
  data.requests = requestList
  this.setData(data)
}


// wallet nickname methods

ConfigManager.prototype.getWalletNicknames = function () {
  const data = this.getData()
  const nicknames = ('walletNicknames' in data) ? data.walletNicknames : {}
  return nicknames
}

ConfigManager.prototype.nicknameForWallet = function (authID) {
  const nicknames = this.getWalletNicknames()
  return nicknames[authID]
}

ConfigManager.prototype.setNicknameForWallet = function (authID, nickname) {
  const nicknames = this.getWalletNicknames()
  nicknames[authID] = nickname
  const data = this.getData()
  data.walletNicknames = nicknames
  this.setData(data)
}

// observable

ConfigManager.prototype.getSalt = function () {
  const data = this.getData()
  return data.salt
}

ConfigManager.prototype.setSalt = function (salt) {
  const data = this.getData()
  data.salt = salt
  this.setData(data)
}

ConfigManager.prototype.subscribe = function (fn) {
  this._subs.push(fn)
  const unsubscribe = this.unsubscribe.bind(this, fn)
  return unsubscribe
}

ConfigManager.prototype.unsubscribe = function (fn) {
  const index = this._subs.indexOf(fn)
  if (index !== -1) {
    this._subs.splice(index, 1)
  }
}

ConfigManager.prototype._emitUpdates = function (state) {
  this._subs.forEach(function (handler) {
    handler(state)
  })
}

ConfigManager.prototype.setLostAccounts = function (lostAccounts) {
  const data = this.getData()
  data.lostAccounts = lostAccounts
  this.setData(data)
}

ConfigManager.prototype.getLostAccounts = function () {
  const data = this.getData()
  return data.lostAccounts || []
}
