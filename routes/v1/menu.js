const express = require("express");

const menuController = require("./../../controllers/v1/menu.js");

const authMiddelware = require("./../../middlewares/auth.js");
const isAdminMiddelware = require("../../middlewares/isAdmin.js");

const router = express.Router();

router
    .route("/")
    .get(menuController.getAll)
    .post(authMiddelware, isAdminMiddelware, menuController.create);

router
    .route("/all")
    .get(authMiddelware, isAdminMiddelware, menuController.getAllInPanel);

router.route('/:id').delete(authMiddelware, isAdminMiddelware, menuController.remove)

module.exports = router;