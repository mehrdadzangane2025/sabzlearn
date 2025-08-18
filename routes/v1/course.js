const express = require("express");
const router = express.Router();

const multer = require("multer");
const multerStorage = require("./../../utils/uploader.js");

const authMiddelware = require("./../../middlewares/auth.js");
const isAdminMiddelware = require("./../../middlewares/isAdmin.js");

const courseController = require("./../../controllers/v1/course.js");

router.route("/").post(
    multer({
        storage: multerStorage,
        limits: {
            fileSize: 1000000000,
        },
    }).single("cover"),
    authMiddelware,
    isAdminMiddelware,
    courseController.create
);
// .get(courseController.getAll);

router.route("/:href").get(authMiddelware, courseController.getOne);

router
    .route("/:id")
    .delete(authMiddelware, isAdminMiddelware, courseController.remove);

router.route("/:id/sessions").post(
    // multer({
    //     storage: multerStorage,
    //     limits: {
    //         fileSize: 1000000000,
    //     },
    // }).single("video"),
    authMiddelware,
    isAdminMiddelware,
    courseController.createSession
);
router.route("/related/:href").get(courseController.getRelatedCourse);
router.route("/category/:href").get(courseController.getCoursesByCategory);

router.route("/:href/:sessionID").get(courseController.getSessionInfo);

router
    .route("/sessions")
    .get(authMiddelware, isAdminMiddelware, courseController.getAll);

router
    .route("/sessions/:id")
    .delete(authMiddelware, isAdminMiddelware, courseController.removeSession);

router.route("/:id/register").post(authMiddelware, courseController.register);

module.exports = router;