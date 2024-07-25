"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const { snakeToCamel } = require("../src/utils");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config
	);
}

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
		const model = require(path.join(__dirname, file))(
			sequelize,
			Sequelize.DataTypes
		);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

sequelize.addHook("afterFind", async (models, options) => {
	const includes = options?.includes;
	if (!Array.isArray(models)) {
		models = [models];
	}
	for (const model of models) {
		if (includes) {
			model.dataValues.includes = {};
			for (const include of includes) {
				if (typeof include === "object") {
					model.dataValues.includes[include.name] = await model[
						`get${snakeToCamel(include.name)}`
					](include.options ?? {});
				} else {
					model.dataValues.includes[include] = await model[
						`get${snakeToCamel(include)}`
					]();
				}
			}
		}
	}
});

sequelize.addHook("beforeSave", async (model, options) => {
	for (const [key, value] of Object.entries(
		model.modelDefinition?.attributes ?? model.rawAttributes
	)) {
		if (value.allowNull && model[key] === "") {
			model[key] = null;
		}
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
