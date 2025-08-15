const express = require("express");

const controller = require("./../../controllers/v1/auth");

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", controller.getMe);
// register - login - getME

module.exports = router;