/*
 * Modules
*/
var fs = require('fs');
var path = require('path');
var unzip = require('unzip2');

var createDir = function(req, res, next) {
  var book = req.files.book[0];
  var dir = './unzips/' + path.basename(book.filename, '.zip');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  req.unzipDir = dir;
  next();
}

var unzipBook = function(req, res, next) {
  var path = req.files.book[0].path;
  var stream = fs.createReadStream(path);
  stream.pipe(unzip.Extract({path:req.unzipDir}));
  next();
}

exports.unziper = [
  createDir,
  unzipBook
]
