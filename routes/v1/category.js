const express = require("express");

const categoryController = require("./../../controllers/v1/category.js");

const authMiddelware = require("./../../middlewares/auth.js");

const isAdminMiddelware = require("./../../middlewares/isAdmin.js");

const router = express.Router();

router
    .route("/")
    .post(authMiddelware, isAdminMiddelware, categoryController.create)
    .get(categoryController.getAll);

router
    .route("/:id")
    .delete(authMiddelware, isAdminMiddelware, categoryController.remove)
    .put(authMiddelware, isAdminMiddelware, categoryController.update);


module.exports = router;