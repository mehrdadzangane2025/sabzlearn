const express = require("express");

const authMiddelware = require("./../../middlewares/auth.js");

const isAdminMiddelware = require("./../../middlewares/isAdmin.js");

const articleController = require("./../../controllers/v1/article.js");

const multer = require("multer");

const { articleCover } = require('./../../utils/uploader.js')

const router = express.Router();

router
    .route("/")
    .get(articleController.getAll)
    .post(
        authMiddelware,
        isAdminMiddelware,
        multer({ storage: articleCover, limits: { fileSize: 1000000000 } }).array(
            "cover",
            5
        ),
        articleController.create
    );

router.route("/:keyword").get(articleController.getOne);

router
    .route("/:id")
    .delete(authMiddelware, isAdminMiddelware, articleController.remove);

router
    .route("/draft")
    .post(
        authMiddelware,
        isAdminMiddelware,
        multer({ storage: articleCover, limits: { fileSize: 1000000000 } }).array(
            "cover",
            5
        ),
        articleController.saveDraft
    );

module.exports = router;