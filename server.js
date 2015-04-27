'use strict';

require('app-module-path').addPath(process.cwd() + '/module') // application specific modules
var express  = require('express')
var app      = express()
var Logger   = require('ceo-logger')
var log      = new Logger({}, false)
var convar   = require('convar')
var pkg      = convar.package
var port     = convar('port')     || 3000
var fs       = require('fs')
var cwd      = process.cwd()
var fireConf = convar('firebase') || {}
var fireUrl  = null
var db       = { available:{}, unusable: [], packages: {} }
var refresh  = 1000 * 60 * 60 // update packages hourly
var FireInit = require('firebase-init')
var fireRef  = null

// load modules
var optional             = require('optional')
var halt                 = require('halt')
var loadFirebaseData     = require('loadFirebaseData')
var updateCdnPackages    = require('updateCdnPackages')
var packageKeyUtils      = require('packageKeyUtils')
var setupDefaultCdnPaths = require('setupDefaultCdnPaths')
var routePack            = [
  'headers', 'api', 'api-package', 'api-latest', 'api-versions', 'prep', 
  'bower', 'npm', 'cdn', 'bootstrap', 'swatch', 'fontawesome', 'foundation', 'material-design', 'devicon', 'flagicon',
  'redirect', 'pack'
]



if (fireConf && fireConf.token) { // initialize if there is a config with a firebase access token
  FireInit(function(error, initializedFirebaseReference) {
    if (error) halt(error)
    fireRef = initializedFirebaseReference
    log.info('Firebase reference ready')
  })
}



function doCdnUpdates() {
  updateCdnPackages(db, function(err, data) {
    if (err) halt(err)
    db = data
    var count = 0
    for (var i in db.packages) {
      if (i) count++
    }
    log.info(count + ' packages updated')
    if (fireRef) { // only if there is an active firebase reference
      var fireData = {
        available: db.available,
        unusable:  db.unusable
      }
      fireData.packages = packageKeyUtils.safeKeys(db.packages)
      fireRef.set(fireData)
      log.info('Packages stored to ' + fireUrl)
    }
  })
}



if (fireConf.name && fireConf.path) { // firebase name & path needed to preload prior data
  fireUrl  = 'https://' + fireConf.name + '.firebaseio.com/' + fireConf.path + '.json'
  loadFirebaseData(fireUrl, function(err, data) {
    if (err) halt(err)
    log.info('Package loaded from ' + fireUrl)
    db = data
    db.package = packageKeyUtils.restoreKeys(db.package)
    log.info('Package keys restored')
    db.unusable = []
    db = setupDefaultCdnPaths(db)
    if (!db.packages) db.packages = {}
  //  doCdnUpdates() // initial update
    setTimeout(doCdnUpdates, refresh) // background updates
  })
} else {
  var data = fs.readFileSync(cwd + '/cdnall_data.json', 'utf8')
  db = JSON.parse(data)
  log.info('cdnall_data.json data loaded') // boot with stale data
  db = setupDefaultCdnPaths(db)
  doCdnUpdates()
}



app.locals.pkg    = pkg
app.locals.logger = log
app.locals.db     = db

app.use(require('express-middleware-rolling-stats'))
app.use(require('express-middleware-ceo-log'))
app.use(require('express-middleware-readme-homepage'))

/* TODO:
function parallel(middlewares) {
  return function (req, res, next) {
    async.each(middlewares, function (mw, cb) {
      mw(req, res, cb);
    }, next);
  };
}

app.use(parallel([
  getUser,
  getSiteList,
  getCurrentSite,
  getSubscription
])); */

for (var i=0; i < routePack.length; i++) { // setup routes
  var rpack = routePack[i]
  var rpack = 'cdnall-' + rpack
  var route = optional('./module/' + rpack)
  if (!route) optional(rpack)
  if (route) {
    log.info(rpack + ' used')
    app.use(route)
  }
}

setTimeout(function() {
  app.listen(port)
  log.info(convar.package.name + ' listening on ' + port)
}, 3000)
