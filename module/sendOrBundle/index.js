var sendOrBundle = function(req, res, next) {
  var pack  = []
  var param = req.params
  console.log(this.params)
  var date = new Date()
  var body = "sendOrBundle: "+ param.length +"<br>\n"
  body += 'Time:' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds() + "<br>\n"
  for (i = 1; i<param.length; i++) {
    body += i + ' param:' + param['pack'+i] + "<br>\n"
  }
  res.send(body)
//  this.body = JSON.stringify(this.params)
}


module.exports = sendOrBundle
