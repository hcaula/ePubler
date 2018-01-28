/*
 * Libs
*/
var uploader = require('../lib/uploader').upload;
var unziper = require('../lib/unziper').unziper;
var epubler = require('../lib/epubler').epubler;
var generateBook = require('../lib/epubler').generateBook;

/*
 * Routes
*/
module.exports = function(app) {
  app.post('/upload', uploader, epubler, returner);
  app.post('/edit', uploader, generateBook, edit);
}

/*
 * Functions
*/
var edit = function(req, res) {
  res.send(req.files);
}

var returner = function(req, res) {
  res.status(200).json(req.book);
}
