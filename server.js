var express  = require('express');
var app      = express();
var Logger   = require('ceo-logger')
var log      = new Logger({}, false)
var convar   = require('convar')
var port     = convar('port') || 3000
var fireConf = convar('firebase')
var fireUrl  = 'https://' + fireConf.name + '.firebaseio.com/' + fireConf.path + '.json'
var db       = { packages: {} }
var refresh  = 1000 * 60 * 60 // update packages hourly
var FireInit = require('firebase-init')
var fireRef  = undefined

// load modules
var halt              = require('./module/halt')
var loadFirebaseData  = require('./module/loadFirebaseData')
var setupRoutes       = require('./module/setupRoutes')
var sendOrBundle      = require('./module/sendOrBundle')
var updateCdnPackages = require('./module/updateCdnPackages')
var firebaseKeyUtils  = require('./module/firebaseKeyUtils')

if (fireConf && fireConf.token) { // initialize if there is a config with a firebase access token
  FireInit(function(error, initializedFirebaseReference) {
    if (error) halt(error)
    fireRef = initializedFirebaseReference
    log.info('Firebase reference ready')

  })
}

function safePackageKeys(packages) {
  var result = {}
  if (packages) {
    for (var i in packages) {
      var key = firebaseKeyUtils.safeKey(i)
      result[key] = firebaseKeyUtils.safeKeys(packages[i])
    }
  }
  return result
}

function restorePackageKeys(packages) {
  var result = {}
  if (packages) {
    for (var i in packages) {
      var key = firebaseKeyUtils.restoreKey(i)
      result[key] = firebaseKeyUtils.restoreKeys(packages[i])
    }
  }
  return result
}

function doCdnUpdates() {
  updateCdnPackages(db, function(err, data) {
    if (err) halt(err)
    db = data
    var count = 0
    for (var i in db.packages) {
      count++
    }
    var json = JSON.stringify(db, null, 2)
    log.info(count + ' packages updated')
    if (fireRef) { // only if there is an active firebase reference
      var fireData = {
        available: db.available,
        unusable:  db.unusable
      }
      fireData.packages = safePackageKeys(db.packages)
      fireRef.set(fireData)
      log.info('Packages stored to ' + fireUrl)
    }
  })
}

function setupDefaultCdnPaths() {
  if (!db.available) db.available = {}
  var available = {
    cdnjs: "https://cdnjs.cloudflare.com/ajax/libs/PACKAGE/VERSION/FILE",
    jsdelivr: "https://cdn.jsdelivr.net/PACKAGE/VERSION/FILE",
  }
  for (var i in available) {
    if (!db.available[i]) db.available[i] = available[i]
  }
}

loadFirebaseData(fireUrl, function(err, data) {
  if (err) halt(err)
  log.info('Package loaded from ' + fireUrl)
  db = data
  restorePackageKeys()
  log.info('Package keys restored')
  db.unusable = []
  setupDefaultCdnPaths()
  if (!db.packages) db.packages = {}
//  doCdnUpdates() // initial update
  setTimeout(doCdnUpdates, refresh) // background updates
})

setupRoutes(app, sendOrBundle, function() {
  app.use(express.static('public'))
  setTimeout(function() {
    app.listen(port)
    log.info(convar.package.name + ' listening on ' + port)
  }, 3000)
})

log.info('startup')
