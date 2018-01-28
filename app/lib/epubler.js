var EPub = require("epub");
var fs = require("fs");
var path = require("path");
var unziper = require("./unziper").unziper;

/*
 * ePubler middleware functions
*/
var getMetadata = function(req, res, next) {
  var book = req.files.book[0];
  var epub = new EPub(book.path);

  epub.on("end", function(){
    req.book = {
      metadata: epub.metadata,
      file: book
    };
    if(epub.metadata.cover) {
      var id = epub.metadata.cover;
      req.book.file.coverPath = epub.manifest[id].href;
    }
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

var getCover = function(req, res, next) {
  var book = req.book;
  if(!book.metadata.cover) next();
  else {
    var unzipPath = 'unzips/' + path.basename(book.file.filename, '.epub') + '/' + book.file.coverPath;
    var copyPath = 'public/images/' + path.basename(book.file.filename, '.epub') + '.jpeg';
    fs.copyFileSync(unzipPath, copyPath);
    req.book.file.publicCover = copyPath.replace("public/images/", "");
    req.book.file.unzipPath = unzipPath;
    next();
  }
}

exports.epubler = [
  getMetadata,
  epubToZip,
  unziper,
  getCover
]

/*
 * GenePub middleware functions
*/

var getOpfFile = function(req, res, next) {
  fs.readdirSync(testFolder).forEach(file => {
    console.log(file);
  })
}

exports.generateBook = [
  getOpfFile
]
