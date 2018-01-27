/*
 * Modules
*/
var fs = require('fs');
var path = require('path');
var unzip = require('unzip2');

var createDir = function(req, res, next) {
  var book = (req.book ? req.book : req.body.book);
  var dir = './unzips/' + path.basename(book.file.filename, '.epub');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  req.unzipDir = dir;
  next();
}

var unzipBook = function(req, res, next) {
  var book = (req.book ? req.book : req.body.book);
  var path = book.file.zipPath;
  var stream = fs.createReadStream(path);
  stream.pipe(unzip.Extract({path:req.unzipDir}));
  next();
}

exports.unziper = [
  createDir,
  unzipBook
]
