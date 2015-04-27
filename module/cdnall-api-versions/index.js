'use strict';

var S         = require('string')
var ignore    = ['latest', 'cdn', 'mains', 'files']
var apiUrl    = '/api/versions/'

function packVersions(name, pack) {
  var result = { name: name, latest: pack.latest, versions: [] }
  for (var i in pack) {
    if (ignore.indexOf(i) < 0 && result.versions.indexOf(i) < 0) {
      var version = S(i).replaceAll(':', '.').s
      result.versions.push(version)
    }
  }
  return result
}

function cdnallApiVersions(req, res, next) {
  var part   = req.path.split(apiUrl)
  var search = (part[1]) ? S(part[1]).trim().s : ''
  if (search.length) {
    var result   = []
    var packages = req.app.locals.db.packages
    for (var packname in packages) {
      if (packname) {
        var cleanname = S(packname).replaceAll(':', '.').s
        var lower     = cleanname.toLowerCase()
        if (S(lower).contains(search)) {
          var pack = packVersions(cleanname, packages[packname])
          if (pack) result.push(pack)
        }
      }
    }
    res.set('Content-Type', 'application/json') // JSONP: application/javascript
    var pretty_json = JSON.stringify(result, null, 2)
    res.status(200).send(pretty_json)
  } else {
    next()
  }
}



module.exports = cdnallApiVersions
