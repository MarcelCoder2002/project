const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/api/me");

router.get("/cart", controllers.getCart);
router.get("/purchases", controllers.getPurchases);
router.get("/", controllers.index);
router.get("/:name", controllers.table);
router.get("/:name/:id", controllers.show);
router.post("/:name/new", controllers.new);
router.put("/:name/edit/:id", controllers.edit);
router.delete("/:name/delete/:id", controllers.delete);

module.exports = router;
