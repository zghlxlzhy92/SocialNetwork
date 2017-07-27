////////////////////////////////
// Upload files to Cloudinary //
////////////////////////////////
var multer = require('multer')
var stream = require('stream')
var cloudinary = require('cloudinary')

// multer parses multipart form data.  Here we tell
// it to expect a single file upload named 'image'
var uploadImage = multer().single('image')

exports.uploadImage = uploadImage

exports.setup = function(app) {
	
}

