const express = require("express");

const commentsController = require("./../../controllers/v1/comment.js");

const authMiddelware = require("./../../middlewares/auth.js");
const isAdminMiddelware = require("../../middlewares/isAdmin.js");

const router = express.Router();

router.route("/").post(authMiddelware, commentsController.create);

router
    .route("/:id")
    .delete(authMiddelware, isAdminMiddelware, commentsController.remove);

router
    .route("/:id/accept")
    .put(authMiddelware, isAdminMiddelware, commentsController.accept);

router
    .route("/:id/reject")
    .put(authMiddelware, isAdminMiddelware, commentsController.reject);

router
    .route("/:id/answer")
    .post(authMiddelware, isAdminMiddelware, commentsController.answer);


module.exports = router;