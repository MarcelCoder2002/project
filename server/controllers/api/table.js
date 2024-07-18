const db = require("../../models");
const { snakeToCamel } = require("../../src/utils");

exports.getGifts = async (req, res, next) => {
	res.json(
		await db.Client.findAll({
			includes: { cheque_cadeau: {} },
		})
	);
};

exports.checkout = async (req, res, next) => {
	try {
		carte_fidelite = await db.CarteFidelite.findOne({
			where: { code: req.body.carte_fidelite },
		});
		if (carte_fidelite) {
			await carte_fidelite.getClient().validatePanierEcommerce();
			res.json({ status: "success" });
		} else {
			res.json({ status: "error", message: "Carte fidélité invalide !" });
		}
	} catch (error) {
		res.status(500).json({ status: "error", message: error.toString() });
	}
};

exports.checkout = async (req, res, next) => {
	try {
		carte_fidelite = await db.CarteFidelite.findOne({
			where: { code: req.body.carte_fidelite },
		});
		if (carte_fidelite) {
			await carte_fidelite.getClient().validatePanierEcommerce();
			res.json({ status: "success" });
		} else {
			res.json({ status: "error", message: "Carte fidélité invalide !" });
		}
	} catch (error) {
		res.status(500).json({ status: "error", message: error.toString() });
	}
};

exports.index = async (req, res, next) => {
	try {
		const Model = db[snakeToCamel(req.params.name)];
		let options = {
			raw: true,
			where: req.query?.where ?? {},
		};
		if (["admin", "client"].includes(req.params.name)) {
			options.attributes = { exclude: ["motDePasse"] };
		}
		res.json(await Model.findAll(options));
	} catch (error) {
		if (error instanceof TypeError) {
			res.status(404).json({
				status: "error",
				message: "Table `" + req.params.name + "` doesn't exist !",
			});
		}
	}
};

exports.show = async (req, res, next) => {
	try {
		const Model = db[snakeToCamel(req.params.name)];
		let options = {
			raw: true,
		};
		if (["admin", "client"].includes(req.params.name)) {
			options.attributes = { exclude: ["motDePasse"] };
		}
		res.json((await Model.findByPk(req.params.id, options)) ?? {});
	} catch (error) {
		if (error instanceof TypeError) {
			res.status(404).json({
				status: "error",
				message: "Table `" + req.params.name + "` doesn't exist !",
			});
		}
	}
};

exports.new = async (req, res, next) => {
	try {
		const Model = db[snakeToCamel(req.params.name)];
		const options = {};
		let data = req.body;
		if (req.body.$dependencies) {
			options.$dependencies = req.body.$dependencies;
			data = req.body[req.params.name];
		}
		console.log(data);
		const model = await Model.create(data, options);
		res.json({
			status: "success",
			message: "Model created !",
			response: model,
		});
	} catch (error) {
		if (error instanceof TypeError) {
			res.status(404).json({
				status: "error",
				message: "Table `" + req.params.name + "` doesn't exist !",
			});
		} else {
			res.json({ status: "error", message: error.message });
		}
	}
};

exports.edit = async (req, res, next) => {
	try {
		const Model = db[snakeToCamel(req.params.name)];
		const model = await Model.findByPk(req.params.id);
		const options = {};
		let data = req.body;
		if (req.body.$dependencies) {
			options.$dependencies = req.body.$dependencies;
			data = req.body[req.params.name];
		}
		if (!data?.motDePasse) {
			delete data.motDePasse;
		}
		await model.update(data, options);
		res.json({
			status: "success",
			message: "Model edited !",
			response: model,
		});
	} catch (error) {
		if (error instanceof TypeError) {
			res.status(404).json({
				status: "error",
				message: "Table `" + req.params.name + "` doesn't exist !",
			});
		} else {
			res.json({ status: "error", message: error.message });
		}
	}
};

exports.delete = async (req, res, next) => {
	try {
		const Model = db[snakeToCamel(req.params.name)];
		const model = await Model.findByPk(req.params.id);
		await model.destroy();
		res.json({
			status: "success",
			message: "Model deleted !",
			response: model,
		});
	} catch (error) {
		if (error instanceof TypeError) {
			res.status(404).json({
				status: "error",
				message: "Table `" + req.params.name + "` doesn't exist !",
			});
		} else {
			res.json({ status: "error", message: error.message });
		}
	}
};
