/*
 * Modules
*/
var multer  = require('multer');
var path = require('path');

/*
 * Auxiliar config
*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/' + file.fieldname);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

/*
 * Upload functions
*/
var upload = multer({storage: storage});

var cpUpload = upload.fields([{ name: 'book', maxCount: 1 }, { name: 'cover', maxCount: 1 }]);

exports.upload = [cpUpload]
