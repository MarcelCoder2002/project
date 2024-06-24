exports.index = (req, res, next) => {
	res.send("Administration");
};

exports.login = (req, res, next) => {
	res.send("Connexion administration");
};

exports.logout = (req, res, next) => {
	res.send("Deconnexion administration");
};
