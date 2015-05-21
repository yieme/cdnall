'use strict';

var _        = require('lodash')
var Logger   = require('ceo-logger')
var log      = new Logger({}, false)
var request         = require('request')
var jsdelivrHandler = require('../jsdelivrHandler')
var completeCallback
var currentCdn      = -1
var cdnList         = [ // initial reference: http://sixrevisions.com/resources/free-public-cdns/
//  { name: 'jquery',   handler: jsdelivrHandler },
  { name: 'bootstrap', handler: jsdelivrHandler },
  { name: 'jsdelivr', handler: jsdelivrHandler },
  { name: 'google',   handler: jsdelivrHandler },
  { name: 'cdnjs',    handler: jsdelivrHandler },
  //  { name: 'microsoft', handler: microsoftHandler }, // http://www.asp.net/ajax/cdn,  ex: http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
  //  { name: 'oss', handler: ossHandler }, // http://osscdn.com/#/
]
var statistics  = []
var db          = {} /*
package_database = { // lowercase is literal, uppercase is variable
  "available": {
    "CDN": {
      "path": "PROTOCOL://DOMAIN/PATH/PACKAGE/VERSION/FILE"
    }
  },
  "PACKAGE_NAME": { ... }
} */


// setup in order async loading and processing
function updateCdnPackages(param, callback) {
  db               = param
  currentCdn       = -1
  completeCallback = callback
  processNextCdn()
}

function processNextCdn(error) {
  if (error) {
    completeCallback(error)
  } else {
    currentCdn++
    if (cdnList[currentCdn]) {
      getDataAndProcess(cdnList[currentCdn].name, cdnList[currentCdn].handler, processNextCdn)
    } else {
      completeCallback(null, db)
    }
  }
}

function getDataAndProcess(cdn, handler, callback) {
  var url = 'http://api.jsdelivr.com/v1/' + cdn + '/libraries'
  request(url, function (error, response, body) {
    if (error) {
      log.error(url + ' load problem: ' + error)
    } else if (response.statusCode != 200) {
      log.warn(url + ' load statusCode: ' + response.statusCode)
    } else {
      log.info(url + ' loaded')
      var data = JSON.parse(body)
      var versions = 0
      for (var i=0; i<data.length; i++) {
        db = handler(db, data[i], cdn)
        versions = versions + data[i].assets.length - 1
      }
      var stats = { cdn: cdn, packages: data.length, versions: versions }
      statistics.push(stats)
      log.info(url + ' processed. ' + JSON.stringify(stats) )
    }
    callback(null)
  })
}

function stats(reset) {
  if (reset) statistics = []
  return statistics
}

module.exports = updateCdnPackages
module.exports.stats = stats
