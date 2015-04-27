'use strict';

var S         = require('string')
var ignore    = ['latest', 'cdn', 'mains', 'files']
var apiUrl    = '/api/package/'


function packDetails(name, pack, selectVersion) {
  var selectVersionLength = (selectVersion) ? selectVersion.length : 0
  var versionCount = 0
  var result = { name: name, versions: {} }
  for (var i in pack) {
    if (ignore.indexOf(i) < 0) {
      var version = S(i).replaceAll(':', '.').s
      if (!selectVersion || version.substr(0, selectVersionLength) == selectVersion) {
        versionCount++
        result.versions[version] = pack[i]
      }
    }
  }
  result.cdn   = pack.cdn
  result.files = pack.files
  result.mains = pack.mains
  return (versionCount) ? result : null
}


function cdnallApiPackage(req, res, next) {
  var part = req.path.split(apiUrl)
  if (part[1]) {
    var packname    = part[1]
    var packages    = req.app.locals.db.packages
    var cleanname   = S(packname).replaceAll(':', '.').s
    var pack = packages[packname]
    if (pack) pack  = packDetails(cleanname, pack)
    if (!pack) pack = null
    res.set('Content-Type', 'application/json') // JSONP: application/javascript
    var pretty_json = JSON.stringify(pack, null, 2)
    res.status(200).send(pretty_json)
  } else {
    next()
  }
}



module.exports = cdnallApiPackage
