const express = require("express");

const userController = require("./../../controllers/v1/user.js");

const authMiddelware = require("./../../middlewares/auth.js");

const isAdminMiddelware = require("./../../middlewares/isAdmin.js");

const router = express.Router();

router.route("/").get(authMiddelware, isAdminMiddelware, userController.getAll);

router.route("/:id").delete(userController.removeUser);

router
    .route("/ban/:id")
    .post(authMiddelware, isAdminMiddelware, userController.banUser);

module.exports = router;