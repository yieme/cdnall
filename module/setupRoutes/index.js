var max_packages   = 5


function setupRoutes(app, handler, callback) {
  var route  = ''
  for (var i = 1; i<= max_packages; i++) {
    route += (i==1) ? '/' : ','
    route += ':pack' + i
    app.get(route, handler)
  }

  callback()
}


module.exports = setupRoutes
