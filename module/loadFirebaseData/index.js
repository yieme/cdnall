'use strict';

var request     = require('request')

function loadFirebaseData(firebaseUrl, callback) {
  if (!firebaseUrl) {
    callback(new Error('Missing firebaseUrl'))
  } else if (firebaseUrl.split('.jso')[1] != 'n') {
      callback(new Error('FirebaseUrl: ' + firebaseUrl + ' missing .json'))
  } else {
    request(firebaseUrl, function (error, response, body) {
      if (error) {
        callback(error)
      } else if (response.statusCode != 200) {
        var error_msg = firebaseUrl + ' statusCode ' + response.statusCode
        callback(new Error(error_msg))
      } else {
        var data = JSON.parse(body)
        callback(null, data)
      }
    })
  }
}


module.exports = loadFirebaseData
