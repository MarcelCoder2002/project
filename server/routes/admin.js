const express = require("express");
const router = express.Router();

const admin_controller = require("../controllers/admin");

router.get("/", admin_controller.index);
router.post("/login", admin_controller.login);
router.get("/logout", admin_controller.logout);

module.exports = router;
