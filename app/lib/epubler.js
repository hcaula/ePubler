var EPub = require("epub");
var fs = require("fs");
var path = require("path");
var unziper = require("./unziper").unziper;

var getMetadata = function(req, res, next) {
  var book = req.files.book[0];
  var epub = new EPub(book.path);

  epub.on("end", function(){
    req.book = {
      metadata: epub.metadata,
      file: book
    };
    next();
  }).parse();
}

var epubToZip = function(req, res, next) {
  var book = req.book;
  if(!book.metadata.cover) next();
  else {
    var zipPath = book.file.destination + '/' + path.basename(book.file.filename, '.epub') + '.zip';
    req.book.file.zipPath = zipPath;
    fs.renameSync(book.file.path, zipPath);
    next();
  }
}

exports.epubler = [
  getMetadata,
  epubToZip,
  unziper
]
