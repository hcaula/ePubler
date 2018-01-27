var http = require('http');
var app = require('./config/express')();
var connection = require('config').connection;

http.createServer(app).listen(app.get('port'), function() {
  var url = connection.protocol + "://";
  url += connection.host;
  url += ":" + connection.port;

  console.log('Express app listening on ' + url);
});
