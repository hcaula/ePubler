var express = require('express');
var load = require('express-load');

module.exports = function() {
  var app = express();

  app.set('port', 3000);

  app.use(express.static('./public'));

  load('controllers', {cwd: 'app'}).into(app);

  return app;
};
