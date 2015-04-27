/*jshint forin: false */
'use strict';


var firebaseKeyUtils  = require('../firebaseKeyUtils')


function safeKeys(packages) {
  var result = {}
  if (packages) {
    for (var i in packages) {
      var key = firebaseKeyUtils.safeKey(i)
      result[key] = firebaseKeyUtils.safeKeys(packages[i])
    }
  }
  return result
}

function restoreKeys(packages) {
  var result = {}
  if (packages) {
    for (var i in packages) {
      var key = firebaseKeyUtils.restoreKey(i)
      result[key] = firebaseKeyUtils.restoreKeys(packages[i])
    }
  }
  return result
}


var packageKeyUtils = {
  safeKeys: safeKeys,
  restoreKeys: restoreKeys
}

module.exports = packageKeyUtils
