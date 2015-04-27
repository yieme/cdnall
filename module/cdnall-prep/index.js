'use strict';

var PACK_SEPERATOR    = '+'
var VERSION_SEPERATOR = '@'
var SERVICE_SEPERATOR = ':'
var FOLDER_SEPERATOR  = '/'

var S         = require('string')

function cdnallPack(req, res, next) {
  var path  = res.locals.path || req.path

  // set debug flag
  if (req.path.substr(0,2) == '/!') {
    res.locals.debug = true
    path = '/' + req.path.substr(2)
    res.locals.path = '/' + path
  }

  // set redirect flag
  if (req.path.substr(0,2) == '/~') {
    res.locals.redirect = true
    path = '/' + req.path.substr(2)
    res.locals.path = '/' + path
  }

  var folder = path.split(FOLDER_SEPERATOR)
  path       = folder[1].split(PACK_SEPERATOR)
  var packs  = []
  for (var i=0; i < path.length; i++) {
    var part = path[i].split(VERSION_SEPERATOR)
    var name = part[0]
    var version = part[1]
    var service
    part = name.split(SERVICE_SEPERATOR)
    if (part[1]) {
      service = part[0]
      name    = part[1]
    }
    var pack = {
      service: service,
      name:    name,
      version: version
    }
    pack=JSON.parse(JSON.stringify(pack))
    packs.push(pack)
  }
  res.locals.pack = packs
  if (folder[2]) {
    folder[0] = ''
    folder[1] = ''
    res.locals.file = S(folder.join('/')).replaceAll('//', '/').replaceAll('//', '/').s
    res.locals.file = res.locals.file.substr(1)
  }
  next()
}



module.exports = cdnallPack
