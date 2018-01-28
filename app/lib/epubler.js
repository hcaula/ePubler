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
    req.book.file.unzipDir = req.unzipDir;
    next();
  }
}

var getOpfFile = function(req, res, next) {
  var opfDir = req.unzipDir + '/OEBPS/';
  var opfFile;
  fs.readdirSync(opfDir).forEach(function(file){
    var extension = path.extname(file);
    if(extension == ".opf") {
      opfFile = file;
      return;
    }
  });
  if(!opfFile) {
    next(new Error("This ePUB doesn't include a OPF file."));
  } else {
    req.book.file.opfFile = opfDir + opfFile;
    next();
  }
}

exports.epubler = [
  getMetadata,
  epubToZip,
  unziper,
  getOpfFile,
  getCover
]

/*
 * GenePub middleware functions
*/
var changeMetadata = function(req, res, next) {
  var metadata = {
    title: req.body.title,
    description: req.body.description,
    language: req.body.language,
    creator: req.body.creator,
    creatorFileAs: req.body.creatorFileAs,
    date: req.body.date
  }

  var data = fs.readFileSync(req.body.opfFile, 'utf-8');
  var old = '<dc:creator opf:file-as="Orwell, George" opf:role="aut">George Orwell</dc:creator>';
  var newy = '<dc:creator opf:file-as="Orwell, George" opf:role="aut">New author test</dc:creator>';
  var newValue = data.replace(old, newy);

  fs.writeFileSync(req.body.opfFile, newValue, 'utf-8');

  next();
}

exports.generateBook = [
  changeMetadata
]
