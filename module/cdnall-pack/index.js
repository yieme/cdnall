'use strict';

var S         = require('string')
var ignore    = ['latest', 'cdn', 'mains', 'files']

function getCdnReference(primaryCdn, list) {
  if (list[primaryCdn]) return primaryCdn
  for (var cdn in list) {
    if (ignore.indexOf(cdn) < 0) {
      return cdn
    }
  }
}


function packDetails(name, pack, selectVersion) {
  if (selectVersion) selectVersion = S(selectVersion).replaceAll('.x', '.').replaceAll('..', '.').replaceAll('..', '.').s
  var selectVersionLength = (selectVersion) ? selectVersion.length : 0
  var result = { name: name }
  for (var i in pack) {
    if (ignore.indexOf(i) < 0) {
      var version = S(i).replaceAll(':', '.').s
      if (!selectVersion || version.substr(0, selectVersionLength) == selectVersion) {
        result.version = version
        result.data = pack[i]
      }
    }
  }
  if (!result.version) return null
  result.cdn   = getCdnReference(pack.cdn, result.data)
  var main     = 0
  var file     = 0
  var cdnRef   = result.data[result.cdn]
  if (typeof cdnRef === 'number') {
    file = cdnRef
  } else {
    main = cdnRef.mains
    file = cdnRef.files
  }
  result.files = pack.files[file].split(',')
  result.main = pack.mains[main]
  result.data = undefined
  return result
}



function cdnallPack(req, res, next) {
  var pack = res.locals.pack
  if (pack) {
    pack            = pack[0]
    var packname    = pack.name
    var version     = pack.version
    var packages    = req.app.locals.db.packages
    var pkg         = packages[packname]
    if (pkg) pkg    = packDetails(packname, pkg, version)
    if (pkg) {
      pkg.cdnPath = req.app.locals.db.available[pkg.cdn]
      var templateData    = {
        package: pkg.name,
        version: pkg.version,
        file:    pkg.main
      }
      console.log(templateData)
      if (res.locals.file) {
        if (res.locals.file.substr(0,1) != '.') {
          templateData.file = res.locals.file
        }
      }
      console.log(templateData, ':', pkg)
      pkg.path    = S(pkg.cdnPath).template(templateData, '{', '}').s
    } else {
      pkg = null
    }
    var data = { packname: packname, file: res.locals.file, pkg: pkg, pack: pack }

    if (res.locals.redirect) {
      res.redirect(302, pkg.path)
    } else if (res.locals.debug) {
      res.set('Content-Type', 'application/json') // JSONP: application/javascript
      var pretty_json = JSON.stringify(data, null, 2)
      res.status(200).send(pretty_json)
    } else {
      res.status(404).send(pkg.path + ' not found')
    }
  } else {
    next()
  }
}



module.exports = cdnallPack
