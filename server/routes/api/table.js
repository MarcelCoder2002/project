const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/api/table");

router.post("/checkout", controllers.checkout);
router.get("/gifts", controllers.getGifts);
router.get("/statistics", controllers.statistics);

router.get("/:name", controllers.index);
router.post("/:name", controllers.index);
router.get("/:name/:id", controllers.show);
router.post("/:name/new", controllers.new);
router.put("/:name/edit/:id", controllers.edit);
router.delete("/:name/delete/:id", controllers.delete);

module.exports = router;
