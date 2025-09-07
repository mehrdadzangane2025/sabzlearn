const express = require("express");

const offController = require("./../../controllers/v1/off.js");

const authMiddelware = require("./../../middlewares/auth.js");
const isAdminMiddelware = require("../../middlewares/isAdmin.js");

const router = express.Router();

router
    .route("/")
    .get(authMiddelware, isAdminMiddelware, offController.getAll)
    .post(authMiddelware, isAdminMiddelware, offController.create);

router
    .route("/all")
    .post(authMiddelware, isAdminMiddelware, offController.setOnAll);

router
    .route("/:code")
    .post(authMiddelware, isAdminMiddelware, offController.getOne);

router
    .route("/:id")
    .delete(authMiddelware, isAdminMiddelware, offController.remove);

module.exports = router;