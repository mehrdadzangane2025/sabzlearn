const express = require("express");

const ticketController = require("../../controllers/v1/ticket.js");

const authMiddelware = require("./../../middlewares/auth.js");

const isAdminMiddelware = require("./../../middlewares/isAdmin.js");

const router = express.Router();

router
    .route("/")
    .post(authMiddelware, ticketController.create)
    .get(authMiddelware, isAdminMiddelware, ticketController.getAll);

router.route("/user").get(authMiddelware, ticketController.userTickets);

router.route("/department").get(ticketController.departments);
router.route("/department/:id/sub/").get(ticketController.departmentsSubs);

router
    .route("/answer")
    .post(authMiddelware, isAdminMiddelware, ticketController.setAnswer);

router.route("/:id/answer").get(authMiddelware, ticketController.getAnswer);

module.exports = router;