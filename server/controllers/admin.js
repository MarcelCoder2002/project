const db = require("../models");

exports.index = (req, res, next) => {
	res.send("Administration");
};

exports.login = (req, res, next) => {
	if (!req.user) {
		req.firewall.authenticator.authenticate(req, res, next);
	}
};

exports.logout = (req, res, next) => {
	res.send("Deconnexion administration");
};
