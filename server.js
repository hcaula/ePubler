var http = require('http');
var app = require('./config/express')();
var connection = require('config').connection;
var fs = require('fs');

http.createServer(app).listen(app.get('port'), function() {
  var url = connection.protocol + "://";
  url += connection.host;
  url += ":" + connection.port;

  createPublicDirectories();

  console.log("Server up at " + new Date());
  console.log('Express app listening on ' + url);
});

var createPublicDirectories = function() {
  var directories = [
    "./uploads/",
    "./uploads/book",
    "./uploads/cover",
    "./unzips/",
    "./public/",
    "./public/images"
  ].forEach(function(dir){
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  });
}
