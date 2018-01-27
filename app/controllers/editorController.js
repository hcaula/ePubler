/*
 * Libs
*/
var uploader = require('../lib/uploader').upload;

/*
 * Routes
*/
module.exports = function(app) {
  app.post('/edit', uploader, edit);
}

/*
 * Functions
*/
var edit = function(req, res) {
  res.send(req.files);
}
