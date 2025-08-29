const express = require("express");

const authMiddelware = require("./../../middlewares/auth.js");
const isAdminMiddelware = require("../../middlewares/isAdmin.js");

const contactController = require("./../../controllers/v1/contact.js");

const router = express.Router();

router
    .route("/")
    .get(authMiddelware, isAdminMiddelware, contactController.getAll)
    .post(contactController.create);

router.route('/:id').delete(contactController.remove)

router.route('/answer').post(authMiddelware, isAdminMiddelware, contactController.answer)

module.exports = router;