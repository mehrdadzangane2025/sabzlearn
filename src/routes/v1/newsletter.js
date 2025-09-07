const express = require("express");

const authMiddelware = require("./../../middlewares/auth.js");
const isAdminMiddelware = require("../../middlewares/isAdmin.js");

const newsletterController = require("./../../controllers/v1/newsletter.js");

const router = express.Router();

router
    .route("/")
    .get(newsletterController.getAll)
    .post(authMiddelware, isAdminMiddelware, newsletterController.create);

module.exports = router;