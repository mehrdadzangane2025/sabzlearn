const express = require("express");

const authMiddelware = require("./../../middlewares/auth.js");
const isAdminMiddelware = require("../../middlewares/isAdmin.js");

const notificationController = require("./../../controllers/v1/notification.js");

const router = express.Router();

router
    .route("/")
    .post(authMiddelware, isAdminMiddelware, notificationController.create)
    .get(authMiddelware, isAdminMiddelware, notificationController.getAll);


router
    .route("/admins/")
    .get(authMiddelware, isAdminMiddelware, notificationController.get);

router
    .route("/:id/see")
    .put(authMiddelware, isAdminMiddelware, notificationController.seen);

module.exports = router;