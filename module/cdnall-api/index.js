'use strict';

var API_URI        = '/api'

function api(req, res, next) {
  if (req.path == API_URI) {
    res.set('Content-Type', 'application/json') // JSONP: application/javascript
    var docs = {
      website:                 '/',
      api_docs:                '/api',
      package_details:         '/api/package/{package}',
      latest_package_versions: '/api/latest/{search}',
      package_versions:        '/api/versions/{search}',
      latest_package:          '/{package}',
      versioned_package:       '/{package}@{version}',
      bundled_packages:        '/{package}[@{version}];{package}[@version]...',
    }
    res.locals.statusCode = 200
    res.status(200).send(JSON.stringify(docs, null, 2))
  } else {
    next()
  }
}



module.exports = api
