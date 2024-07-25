const db = require("../../models");
const ChequeCadeau = require("../../models/ChequeCadeau")(db.sequelize);
const { Op } = require("sequelize");
const { snakeToCamel } = require("../../src/utils");

exports.statistics = async (req, res, next) => {
	const currentYear = new Date().getFullYear();

	const allMonths = Array.from({ length: 12 }, (v, i) =>
		new Date(currentYear, i, 5).toISOString().slice(0, 7)
	);

	const comlete = (results, types) => {
		if (types) {
			const completeResults = [];
			types.forEach((type) => {
				allMonths.forEach((label) => {
					const found = results.find(
						(result) =>
							result.label === label && result.type === type
					);
					completeResults.push(
						found ? found : { label, type, value: 0 }
					);
				});
			});
			return completeResults;
		} else {
			return allMonths.map((label) => {
				const found = results.find(
					(result) =>
						result.label === label ||
						result.label.slice(0, 7) === label
				);
				return found ? found : { label, value: 0 };
			});
		}
	};

	const groupedGiftCards = await db.ChequeCadeau.findAll({
		attributes: [
			[
				db.sequelize.fn(
					"DATE_FORMAT",
					db.sequelize.col("date_creation"),
					"%Y-%m"
				),
				"month",
			],
			"statut",
			[db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
		],
		where: {
			date_creation: {
				[Op.gte]: new Date(currentYear, 0, 1),
				[Op.lt]: new Date(currentYear + 1, 0, 1),
			},
		},
		group: [
			"statut",
			db.sequelize.fn(
				"DATE_FORMAT",
				db.sequelize.col("date_creation"),
				"%Y-%m"
			),
		],
		order: [
			["statut", "ASC"],
			[
				db.sequelize.fn(
					"DATE_FORMAT",
					db.sequelize.col("date_creation"),
					"%Y-%m"
				),
				"ASC",
			],
		],
	});

	const monthlySignups = await db.Client.findAll({
		attributes: [
			[
				db.sequelize.fn(
					"DATE_FORMAT",
					db.sequelize.col("date_creation"),
					"%Y-%m-01"
				),
				"month",
			],
			[db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
		],
		where: {
			date_creation: {
				[Op.gte]: new Date(currentYear, 0, 1),
				[Op.lt]: new Date(currentYear + 1, 0, 1),
			},
		},
		group: [
			db.sequelize.fn(
				"DATE_FORMAT",
				db.sequelize.col("date_creation"),
				"%Y-%m-01"
			),
		],
		order: [
			[
				db.sequelize.fn(
					"DATE_FORMAT",
					db.sequelize.col("date_creation"),
					"%Y-%m-01"
				),
				"ASC",
			],
		],
	});

	const monthlyRevenue = await db.Achat.findAll({
		attributes: [
			[
				db.sequelize.fn(
					"DATE_FORMAT",
					db.sequelize.col("date"),
					"%Y-%m"
				),
				"month",
			],
			[db.sequelize.fn("SUM", db.sequelize.col("total")), "totalRevenue"],
		],
		where: {
			date: {
				[Op.gte]: new Date(currentYear, 0, 1),
				[Op.lt]: new Date(currentYear + 1, 0, 1),
			},
		},
		group: [
			db.sequelize.fn("DATE_FORMAT", db.sequelize.col("date"), "%Y-%m"),
		],
		order: [
			[
				db.sequelize.fn(
					"DATE_FORMAT",
					db.sequelize.col("date"),
					"%Y-%m"
				),
				"ASC",
			],
		],
	});

	res.json({
		client: {
			count: (await db.Client.findAndCountAll()).count,
			monthlySignups: comlete(
				monthlySignups.map((entry) => ({
					label: entry.get("month"),
					value: entry.get("count"),
				}))
			),
		},
		cheque_cadeau: {
			groupedGiftCards: comlete(
				groupedGiftCards.map((entry) => ({
					label: entry.get("month"),
					value: entry.get("count"),
					type: entry.get("statut"),
				})),
				["En attente", "Récupéré", "Consommé", "Expiré"]
			),
		},
		achat: {
			monthlyRevenue: comlete(
				monthlyRevenue.map((entry) => ({
					label: entry.get("month"),
					value: entry.get("totalRevenue"),
				}))
			),
		},
	});
};

exports.getGifts = async (req, res, next) => {
	res.json(
		await db.Client.findAll({
			includes: ["carte_fidelite", "cheque_cadeau"],
		})
	);
};

exports.checkout = async (req, res, next) => {
	try {
		const cheques_cadeaux = req.body.cheques_cadeaux ?? [];
		const cheques_cadeau_valides = [];
		const produits = req.body.produits;
		const carte_fidelite = await db.CarteFidelite.findOne({
			where: { code: req.body.carte_fidelite },
		});
		if (carte_fidelite) {
			const client = await carte_fidelite.getClient();
			let cheque_cadeau;
			for (const code_cheque_cadeau of cheques_cadeaux) {
				cheque_cadeau = await db.ChequeCadeau.findOne({
					where: { code: code_cheque_cadeau },
				});
				if (cheque_cadeau && cheque_cadeau.isValid()) {
					cheques_cadeau_valides.push(cheque_cadeau);
				} else {
					res.json({
						status: "error",
						message: `Chèque cadeau '${code_cheque_cadeau}' invalide !`,
					});
					return;
				}
			}
			const total = await produits.reduce(async (acc, item) => {
				const produit = await db.Produit.findByPk(item.id, {
					includes: ["promotion"],
				});
				const promotion =
					produit.dataValues.includes.promotion &&
					produit.dataValues.includes.promotion?.isValid()
						? produit.dataValues.includes.promotion.pourcentage
						: 0;
				const t = produit.prix - (produit.prix * promotion) / 100;
				return (
					t * parseInt(item.quantite) +
					(acc instanceof Promise ? await acc : acc)
				);
			}, 0);
			if (cheques_cadeau_valides.length * 100 <= total) {
				client.validatePanierMagasin(produits, 1);
				for (const cheque_cadeau_valide of cheques_cadeau_valides) {
					cheque_cadeau_valide.update({
						statut: ChequeCadeau.STATUT.CONSOMME,
					});
				}
			} else {
				res.json({
					status: "error",
					message: `La somme des chèques cadeaux dépasse le total !`,
				});
				return;
			}
			res.json({ status: "success" });
		} else {
			res.json({
				status: "error",
				message: `Carte fidélité '${req.body.carte_fidelite}' invalide !`,
			});
		}
	} catch (error) {
		res.status(500).json({ status: "error", message: error.toString() });
	}
};

exports.index = async (req, res, next) => {
	try {
		const Model = db[snakeToCamel(req.params.name)];
		let options = {
			raw: !req.query?.includes,
			where: req.query?.where ?? {},
		};
		if (["admin", "client"].includes(req.params.name)) {
			options.attributes = { exclude: ["motDePasse"] };
		}
		if (req.query?.includes) {
			options.includes = req.query?.includes;
		}
		res.json(await Model.findAll(options));
	} catch (error) {
		if (error instanceof TypeError) {
			res.status(404).json({
				status: "error",
				message: "La table `" + req.params.name + "` n'existe pas !",
			});
		}
	}
};

exports.show = async (req, res, next) => {
	try {
		const Model = db[snakeToCamel(req.params.name)];
		let options = {
			raw: !req.query?.includes,
		};
		if (["admin", "client"].includes(req.params.name)) {
			options.attributes = { exclude: ["motDePasse"] };
		}
		if (req.query?.includes) {
			options.includes = req.query?.includes;
		}
		res.json((await Model.findByPk(req.params.id, options)) ?? {});
	} catch (error) {
		if (error instanceof TypeError) {
			console.log(error);
			res.status(404).json({
				status: "error",
				message: "La table `" + req.params.name + "` n'existe pas !",
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
		const model = await Model.create(data, options);
		res.json({
			status: "success",
			message: "La nouvelle ligne à bien été ajoutée !",
			response: model,
		});
	} catch (error) {
		if (error instanceof TypeError) {
			res.status(404).json({
				status: "error",
				message: "La table `" + req.params.name + "` n'existe pas !",
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
			message: "La ligne à bien été modifiée !",
			response: model,
		});
	} catch (error) {
		if (error instanceof TypeError) {
			res.status(404).json({
				status: "error",
				message: "La table `" + req.params.name + "` n'existe pas !",
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
			message: "La ligne à bien été supprimée !",
			response: model,
		});
	} catch (error) {
		if (error instanceof TypeError) {
			res.status(404).json({
				status: "error",
				message: "La table `" + req.params.name + "` n'existe pas !",
			});
		} else {
			res.json({ status: "error", message: error.message });
		}
	}
};
