const express = require("express");

const userController = require("./../../controllers/v1/user.js");

const authMiddelware = require("./../../middlewares/auth.js");

const isAdminMiddelware = require("./../../middlewares/isAdmin.js");

const router = express.Router();

router.route("/").get(authMiddelware, isAdminMiddelware, userController.getAll).put(authMiddelware, userController.updateUser);

router.route("/role").put(authMiddelware, isAdminMiddelware, userController.changeRole);


router.route("/:id").delete(authMiddelware, isAdminMiddelware, userController.removeUser);

router
    .route("/ban/:id")
    .post(authMiddelware, isAdminMiddelware, userController.banUser);

module.exports = router;