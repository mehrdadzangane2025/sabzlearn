const path = require("path");

const crypto = require("crypto");

const multer = require("multer");

const courseCover = multer.diskStorage({
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

const articleCover = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "public", "articles", "covers"));
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

module.exports = {
    courseCover,
    articleCover
}