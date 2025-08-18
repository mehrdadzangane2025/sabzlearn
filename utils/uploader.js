const path = require("path");

const crypto = require("crypto");

const multer = require("multer");

module.exports = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "public", "courses", "covers"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const hashedFilename = crypto
            .createHash("SHA256")
            .update(file.originalname)
            .digest("hex");
        const fileName = Date.now() + String(Math.random() * 9999);
        cb(null, fileName + ext);
    },
});