const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 &&
			file !== basename &&
			file.slice(-3) === ".js" &&
			file.indexOf(".test.js") === -1
		);
	})
	.forEach((file) => {
		router.use(
			"/" + path.parse(file).name,
			require(path.join(__dirname, file))
		);
	});

module.exports = router;
