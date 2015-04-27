'use strict';

var CACHE_DURATION = 60//*60 // hour
//var precisetime = require('precisetime')

function cdnallHeaders(req, res, next) {
  res.header('X-Powered-By', req.app.locals.pkg.name + '/' + req.app.locals.pkg.version)
  res.header('Cache-Control', 'public, max-age=' + CACHE_DURATION + ', s-maxage=' + CACHE_DURATION)
  next()
}



module.exports = cdnallHeaders
