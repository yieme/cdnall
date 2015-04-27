'use strict';

var S         = require('string')
var API_URI   = '/api/latest/'


function latestPack(name, pack) {
  var result = name + '@' + pack.latest
  return result
}

function cdnallApiLatest(req, res, next) {
  var part   = req.path.split(API_URI)
  var search = (part[1]) ? S(part[1]).trim().s : ''
  if (search.length) {
    var result   = []
    var packages = req.app.locals.db.packages
    for (var packname in packages) {
      if (packname) {
        var cleanname = S(packname).replaceAll(':', '.').s
        var lower     = cleanname.toLowerCase()
        if (S(lower).contains(search)) {
          var pack = latestPack(cleanname, packages[packname])
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



module.exports = cdnallApiLatest
