const db = require("../models");

exports.index = (req, res, next) => {
	db.Client.findByPk(3, { include: db.ChequeCadeau }).then((client) => {
		res.json(client);
	});
};

exports.login = (req, res, next) => {
	res.send("Connexion profile");
};

exports.logout = (req, res, next) => {
	res.send("Deconnexion profile");
};
