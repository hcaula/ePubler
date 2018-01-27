/*
 * Modules
*/
var multer  = require('multer');
var path = require('path');
var fs = require('fs');

/*
 * Auxiliar config
*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/' + file.fieldname);
  },
  filename: function (req, file, cb) {
    var format = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + format);
  }
});

var supported = ['.jpeg', '.jpg', '.png'];

var upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    var format = path.extname(file.originalname);
    if (file.fieldname == 'book' && format != '.epub') cb(null, false);
    else if (file.fieldname == 'cover' && !supported.includes(format)) cb(null, false);
    else cb(null, true);
  }
});

/*
 * Lib functions
*/
exports.upload = [
  upload.fields([{ name: 'book', maxCount: 1 }, { name: 'cover', maxCount: 1 }])
];
