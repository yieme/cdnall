'use strict';

var Logger   = require('ceo-logger')
var log      = new Logger({}, false)

var expressMiddlewareCeoLog = { postlog: false } // truthy to log after the fact

function requestLog(req, res, next) {
  if (!expressMiddlewareCeoLog.postlog) {
    log.info(req.method + ' ' + req.path)
  }
  next()
  if (expressMiddlewareCeoLog.postlog) {
    if (res.locals.statusCode) {
      log.info(res.locals.statusCode + ' ' + req.method + ' ' + req.path)
    } else {
      log.info(req.method + ' ' + req.path)
    }
  }
}


function requestError(err, req, res, next) {
  res.status(500).send('Internal Error')
  if (expressMiddlewareCeoLog.postlog) {
    log.error('500 ' + req.method + ' ' + req.path)
  } else {
    log.error(req.method + ' ' + req.path)
  }
  log.error(err.name + ': ' + err.message)
  log.error(err.stack)
  next()
}

expressMiddlewareCeoLog.log    = requestLog
expressMiddlewareCeoLog.errlog = requestError

module.exports = expressMiddlewareCeoLog
