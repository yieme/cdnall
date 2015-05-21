'use strict';

var S         = require('string')
var ignore    = ['latest', 'cdn', 'mains', 'files']
var request   = require('request')

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
        result.data    = pack[i]
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
  function getFile(url, cb) {
    req.app.locals.logger.info('getFile ' + url)
    request(url, function (error, response, body) {
      if (error) {
        cb(error)
      } else {
        var data = {
          type: response.headers['content-type'],
          body: body
        }
        cb(null, data)
      }
    })
  }

  var pack = res.locals.pack
  if (pack) {
    pack            = pack[0]
    var packname    = pack.name
    var version     = pack.version
    var packages    = req.app.locals.db.packages
    var pkg         = packages[packname]
    var data
    var pretty_json
    if (pkg) pkg    = packDetails(packname, pkg, version)
    if (pkg) {
      pkg.cdnPath = req.app.locals.db.available[pkg.cdn]
      var templateData    = {
        package: pkg.name,
        version: pkg.version,
        file:    pkg.main
      }
      if (res.locals.file) {
        if (res.locals.file.substr(0,1) != '.') {
          templateData.file = res.locals.file
        }
      }
//      console.log(templateData, ':', pkg)
      pkg.path = S(pkg.cdnPath).template(templateData, '{', '}').s
      data     = { packname: packname, file: res.locals.file, pkg: pkg, pack: pack }

      if (res.locals.redirect) {
        res.locals.statusCode = 302
        res.redirect(302, pkg.path)
      } else if (res.locals.debug) {
        res.set('Content-Type', 'application/json') // JSONP: application/javascript
        pretty_json = JSON.stringify(data, null, 2)
        res.locals.statusCode = 200
        res.status(200).send(pretty_json)
      } else {
        getFile(pkg.path, function(error, data) {
          if (error) {
            res.locals.statusCode = 500
            next(error)
          } else {
            res.set('Content-Type', data.type) // content-encoding: gzip
            res.locals.statusCode = 200
            res.status(200).send(data.body)
          }
        })
      }
    } else {
      if (res.locals.debug) {
        res.set('Content-Type', 'application/json') // JSONP: application/javascript
        data = {
          'error': "Not Found",
          pack: pack
        }
        pretty_json = JSON.stringify(data, null, 2)
        res.locals.statusCode = 200
        res.status(200).send(pretty_json)
      } else {
        res.locals.statusCode = 404
          res.status(404).send('Not Found')
      }
    }
  } else {
    next()
  }
}



module.exports = cdnallPack
