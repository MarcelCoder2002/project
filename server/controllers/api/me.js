const db = require("../../models");
const { snakeToCamel } = require("../../src/utils");

exports.checkout = async (req, res, next) => {
	if (req.user.getRoles().includes("ROLE_CLIENT")) {
		await req.user.validatePanierEcommerce();
		res.json({ status: "success" });
	} else {
		res.json({});
	}
};

exports.getCart = async (req, res, next) => {
	if (req.user.getRoles().includes("ROLE_CLIENT")) {
		res.json(
			await req.user.getPanierEcommerce({
				includes: [
					{ name: "produit", options: { includes: ["promotion"] } },
				],
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
				order: [["date", "ASC"]],
				includes: [
					{ name: "detail", options: { includes: ["produit"] } },
				],
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

	if (req.query?.includes && req.user.getRoles().includes("ROLE_CLIENT")) {
		data.includes = {};
		for (const table of req.query.includes) {
			try {
				let Model;
				let options = {};
				let tableName;
				if (typeof table === "object") {
					tableName = table.name;
					Model = db[snakeToCamel(table.name)];
					options = table.options ?? options;
				} else {
					tableName = table;
					Model = db[snakeToCamel(table)];
				}
				options.where = options.where ?? {};
				if (tableName !== "client") {
					options.where.client = req.user.id;
				} else {
					options.where.id = req.user.id;
				}
				data.includes[tableName] = await Model.findAll(options);
			} catch (error) {
				console.log(error);
			}
		}
		// console.log(req.query?.includes, req.user, data);
	} else if (
		req.query?.includes &&
		req.user.getRoles().includes("ROLE_ADMIN")
	) {
		data.includes = {};
		for (const table of req.query.includes) {
			try {
				let Model;
				let options = {};
				let tableName;
				if (typeof table === "object") {
					tableName = table.name;
					Model = db[snakeToCamel(table.name)];
					options = table.options ?? options;
				} else {
					tableName = table;
					Model = db[snakeToCamel(table)];
				}
				options.where = options.where ?? {};
				options.where = options.where ?? {};
				if (tableName !== "admin") {
					if (["notification", "message"]) {
						options.where.client = null;
					} else {
						options.where.admin = req.user.id;
					}
				} else {
					options.where.id = req.user.id;
				}
				data.includes[tableName] = await Model.findAll(options);
			} catch (error) {}
		}
	}
	res.json(data);
};

exports.table = async (req, res, next) => {
	try {
		const Model = db[snakeToCamel(req.params.name)];
		let options = {
			raw: !req.query?.includes,
			where: req.query?.where ?? {},
			update: req.query?.update ?? false,
		};
		if (["admin", "client"].includes(req.params.name)) {
			options.attributes = { exclude: ["motDePasse"] };
			options.where.id = req.user.id;
		}
		if (req.query?.includes) {
			options.includes = req.query.includes;
		}
		if (
			req.user.getRoles().includes("ROLE_CLIENT") &&
			req.params.name !== "client"
		) {
			options.where.client = req.user.id;
		} else if (
			!!Model.getAttributes()["admin"] &&
			req.params.name !== "admin"
		) {
			options.where.admin = req.user.id;
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
			raw: !req.query?.includes,
			update: req.query?.update ?? false,
		};
		if (["admin", "client"].includes(req.params.name)) {
			options.attributes = { exclude: ["motDePasse"] };
		}
		if (req.query?.includes) {
			options.includes = req.query?.includes;
		}
		let model = (await Model.findByPk(req.params.id, options)) ?? {};
		if (req.user.getRoles().includes("ROLE_CLIENT")) {
			if (
				!!Model.getAttributes()["client"] &&
				`${model?.client}` === `${req.user.id}`
			) {
				res.json(model);
			} else if (
				!!Model.getAttributes()["admin"] &&
				`${model?.admin}` === `${req.user.id}`
			) {
				res.json(model);
			} else {
				res.status(403).json({
					status: "error",
					message: "Accès refusé  !",
				});
			}
		} else {
			res.json(model);
		}
	} catch (error) {
		if (error instanceof TypeError) {
			console.log(error);
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
		if (req.body.msg) {
			options.msg = req.body.msg;
		}
		console.log(req.body);
		let model = {};
		if (req.user.getRoles().includes("ROLE_CLIENT")) {
			if (!!Model.getAttributes()["client"]) {
				data.client = req.user.id;
				model = await Model.create(data, options);
				res.json({
					status: "success",
					message: "La nouvelle ligne à bien été ajoutée !",
					response: model,
				});
			} else if (!!Model.getAttributes()["admin"]) {
				data.admin = req.user.id;
				model = await Model.create(data, options);
				res.json({
					status: "success",
					message: "La nouvelle ligne à bien été ajoutée !",
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
				message: "La nouvelle ligne à bien été ajoutée !",
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
					message: "La ligne à bien été modifiée !",
					response: model,
				});
			} else if (
				!!Model.getAttributes()["admin"] &&
				`${model?.admin}` === `${req.user.id}`
			) {
				await model.update(data, options);
				res.json({
					status: "success",
					message: "La ligne à bien été modifiée !",
					response: model,
				});
			} else {
				res.status(403).json({
					status: "error",
					message: "Accès refusé !",
				});
			}
		} else {
			await model.update(data, options);
			res.json({
				status: "success",
				message: "La ligne à bien été modifiée !",
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
					message: "La ligne à bien été supprimée !",
					response: model,
				});
			} else if (
				!!Model.getAttributes()["admin"] &&
				`${model?.admin}` === `${req.user.id}`
			) {
				await model.destroy();
				res.json({
					status: "success",
					message: "La ligne à bien été supprimée !",
					response: model,
				});
			} else {
				res.status(403).json({
					status: "error",
					message: "Accès refusé !",
				});
			}
		} else {
			await model.destroy();
			res.json({
				status: "success",
				message: "La ligne à bien été supprimée !",
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

exports.deleteAll = async (req, res, next) => {
	try {
		const Model = db[snakeToCamel(req.params.name)];
		if (req.user.getRoles().includes("ROLE_CLIENT")) {
			if (!!Model.getAttributes()["client"]) {
				await Model.destroy({ where: { client: req.user.id } });
				res.json({
					status: "success",
					message: "Models deleted !",
				});
			} else if (!!Model.getAttributes()["admin"]) {
				await Model.destroy({ where: { admin: req.user.id } });
				res.json({
					status: "success",
					message: "Models deleted !",
				});
			} else {
				res.status(403).json({
					status: "error",
					message: "Accès refusé  !",
				});
			}
		} else {
			await Model.destroy();
			res.json({
				status: "success",
				message: "Models deleted !",
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
