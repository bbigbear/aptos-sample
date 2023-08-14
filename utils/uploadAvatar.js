const multer = require('multer');
const path = require('path');
const fs = require('fs') ;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/avatars/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname);
    }
});

const checkFile = (file, cb) => {
    if (file?.originalname) cb(null, true);
    else    cb(null, false); 
}

const uploadAvatar = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: (req, file, cb) => {
        checkFile(file, cb);
    }
}).any() ;

module.exports = uploadAvatar;
