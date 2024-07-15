const db = require("../../models");
const { snakeToCamel } = require("../../src/utils");

exports.getCart = async (req, res, next) => {
	if (req.user.getRoles().includes("ROLE_CLIENT")) {
		res.json(
			await req.user.getPanierEcommerce({
				includes: { produit: { includes: { promotion_produit: {} } } },
			})
		);
	} else {
		res.json({});
	}
};

exports.getPurchases = async (req, res, next) => {
	if (req.user.getRoles().includes("ROLE_CLIENT")) {
		res.json(
			await req.user.getAchat({
				includes: { detail: { includes: { produit: {} } } },
			})
		);
	} else {
		res.json({});
	}
};

exports.index = async (req, res, next) => {
	const data = {
		id: req.user.id,
		email: req.user.email,
		nom: req.user.nom,
		prenom: req.user.prenom,
		adresse: req.user.adresse,
		roles: req.user.getRoles(),
	};

	if (req.query?.include && req.user.getRoles().includes("ROLE_CLIENT")) {
		data.includes = {};
		for (const table of req.query.include) {
			try {
				const Model = db[snakeToCamel(table)];
				data.includes[table] = await Model.findAll({
					where: { client: req.user.id },
				});
			} catch (error) {}
		}
	}

	res.json(data);
};

exports.table = async (req, res, next) => {
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
		let model = (await Model.findByPk(req.params.id, options)) ?? {};
		if (req.user.getRoles().includes("ROLE_CLIENT")) {
			if (
				req.params.name !== "admin" ||
				(!!Model.getAttributes()["client"] &&
					`${model?.client}` === `${req.user.id}`)
			) {
				res.json(model);
			} else {
				res.status(403).json({
					status: "error",
					message: "Access denied !",
				});
			}
		} else {
			res.json(model);
		}
	} catch (error) {
		if (error instanceof TypeError) {
			res.status(404).json({
				status: "error",
				message: "Table `" + req.params.name + "` doesn't exist !",
			});
		} else {
			console.log(error);
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
		let model = {};
		if (req.user.getRoles().includes("ROLE_CLIENT")) {
			if (!!Model.getAttributes()["client"]) {
				data.client = req.user.id;
				model = await Model.create(data, options);
				res.json({
					status: "success",
					message: "Model created !",
					response: model,
				});
			} else {
				res.status(403).json({
					status: "error",
					message: "Access denied !",
				});
			}
		} else {
			model = await Model.create(data, options);
			res.json({
				status: "success",
				message: "Model created !",
				response: model,
			});
		}
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
		if (req.user.getRoles().includes("ROLE_CLIENT")) {
			if (
				!!Model.getAttributes()["client"] &&
				`${model?.client}` === `${req.user.id}`
			) {
				await model.update(data, options);
				res.json({
					status: "success",
					message: "Model edited !",
					response: model,
				});
			} else {
				res.status(403).json({
					status: "error",
					message: "Access denied !",
				});
			}
		} else {
			await model.update(data, options);
			res.json({
				status: "success",
				message: "Model edited !",
				response: model,
			});
		}
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
		if (req.user.getRoles().includes("ROLE_CLIENT")) {
			if (
				!!Model.getAttributes()["client"] &&
				`${model?.client}` === `${req.user.id}`
			) {
				await model.destroy();
				res.json({
					status: "success",
					message: "Model deleted !",
					response: model,
				});
			} else {
				res.status(403).json({
					status: "error",
					message: "Access denied !",
				});
			}
		} else {
			await model.destroy();
			res.json({
				status: "success",
				message: "Model deleted !",
				response: model,
			});
		}
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
