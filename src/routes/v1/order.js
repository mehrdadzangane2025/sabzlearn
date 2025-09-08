const express = require("express");

const orderController = require("./../../controllers/v1/order.js");

const authMiddelware = require("./../../middlewares/auth.js");

const isAdminMiddelware = require("./../../middlewares/isAdmin.js");

const router = express.Router();

router.route('/').get(authMiddelware, orderController.getAll)
router.route('/:id').get(authMiddelware, orderController.getOne)
    /*
    router.get("/register", (req, res) => {
      res.send("Register page");
    });*/
module.exports = router;