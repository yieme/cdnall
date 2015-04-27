'use strict';

var Logger   = require('ceo-logger')
var log      = new Logger({}, false)

function expressMiddlewareCeoLog(req, res, next) {
  log.info(req.path)
  next()
}



module.exports = expressMiddlewareCeoLog
