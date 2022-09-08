const multer = require('multer');

//Possible mime types for uploaded images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}

//Configuration of multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
})

module.exports = multer({storage}).single('image');