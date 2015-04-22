var Logger   = require('ceo-logger')
var log      = new Logger({}, true)

function halt(msg) {
  log.error('Halt:', msg);
  process.exit(1);
}


module.exports = halt
