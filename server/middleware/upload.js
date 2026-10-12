// middleware/upload.js
// Uploads are held in memory, so they MUST be size-limited and type-checked.
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // 2 MB, one file
    fileFilter: (req, file, cb) =>
        file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only image uploads are allowed')),
});

module.exports = upload;