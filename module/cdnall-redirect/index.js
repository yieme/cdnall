'use strict';

function cdnallRedirect(req, res, next) {
  if (req.path.substr(0,2) == '/~') {
    res.locals.redirect = true
    res.locals.path = '/' + req.path.substr(2)
  }
  next()
}



module.exports = cdnallRedirect
