var S = require('string')

function safeKey(key) {
  return S(key).replaceAll('.', ':').s
}

function restoreKey(safeKey) {
  return S(key).replaceAll(':', '.').s
}

function safeKeys(obj) {
  var result = {}
  for (var i in obj) {
    var key = safeKey(i)
    result[key] = obj[i]
  }
  return result
}

function restoreKeys(obj) {
  var result = {}
  for (var i in obj) {
    var key = restoreKey(i)
    result[key] = obj[i]
  }
  return result
}

var firebaseKeys = {
  safeKey:     safeKey,
  restoreKey:  restoreKey,
  safeKeys:    safeKeys,
  restoreKeys: restoreKeys
}

module.exports = firebaseKeys
