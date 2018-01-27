/*
 * Libs
*/
var uploader = require('../lib/uploader').upload;
var unziper = require('../lib/unziper').unziper;

/*
 * Routes
*/
module.exports = function(app) {
  app.post('/edit', uploader, unziper, edit);
}

/*
 * Functions
*/
var edit = function(req, res) {
  res.send(req.files);
}
