exports.index = (req, res, next) => {
	res.send("Profile");
};

exports.login = (req, res, next) => {
	res.send("Connexion profile");
};

exports.logout = (req, res, next) => {
	res.send("Deconnexion profile");
};
