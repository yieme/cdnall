'use strict';

var fs       = require('fs')
var hogan    = require("hogan.js")
var index    = fs.readFileSync(__dirname + '/index.mustache', 'utf8')
var readme   = fs.readFileSync(process.cwd() + '/README.md', 'utf8')
var template = hogan.compile(index)
var page     = null

function cdnallHomepage(req, res, next) {
  if (req.path == '/') {
    res.set('Content-Type', 'text/html')
    if (!page) {
      var data = {
        name: req.app.locals.pkg.name,
        version: req.app.locals.pkg.version,
        readme: readme
      }
      page = template.render(data)
    }
    res.locals.statusCode = 200
    res.status(200).send(page)
  } else if (req.path == '/favicon.ico') {
    res.locals.statusCode = 404
    res.status(404).send('Not Found')
  } else {
    next()
  }
}



module.exports = cdnallHomepage
