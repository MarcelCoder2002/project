const express = require("express");
const router = express.Router();

const profile_controller = require("../controllers/profile");

router.get("/", profile_controller.index);
router.post("/login", profile_controller.login);
router.get("/logout", profile_controller.logout);

module.exports = router;
