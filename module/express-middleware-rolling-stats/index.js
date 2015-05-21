'use strict';

if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

var Stats       = require('rolling-stats')

//var clock       = new Date   /* require('precisetime') */
var size        = 1024
var duration    = 60000
var stats       = Stats(size, duration)
var API_URI     = '/api/stats'


function expressMiddlewareRollingStats(req, res, next) {
  if (req.url == API_URI) {
    var data = stats.calculate()
    res.set('Content-Type', 'application/json') // JSONP: application/javascript
    res.locals.statusCode = 200
    res.status(200).send(JSON.stringify(data, null, 2))
  } else {
    res.locals._startTime = new Date().valueOf()
    next()
    var duration = new Date().valueOf() - res.locals._startTime
    stats.point(duration)
  }
}



module.exports = expressMiddlewareRollingStats
