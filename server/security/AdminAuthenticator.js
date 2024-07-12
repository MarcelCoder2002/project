const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config.json");
const { Admin } = require("../models");

module.exports = () => {
	class AdminAuthenticator {
		async authenticate(req, res, next) {
			const admin = await Admin.findOne({
				where: { email: req.body.email },
			});
			if (admin) {
				if (
					await bcrypt.compare(req.body.motDePasse, admin.motDePasse)
				) {
					res.json({
						accessToken: sign(
							{
								id: admin.id,
								email: req.body.email,
								type: "admin",
							},
							config.env.JWT_SECRET_KEY
						),
					});
				} else {
					res.status(403).json({
						status: "error",
						message: "Mot de passe incorrecte !",
					});
				}
			} else {
				res.status(403).json({
					status: "error",
					message: "Email incorrecte !",
				});
			}
		}

		onAuthenticationSuccess(req, res, next) {
			res.redirect(req.target ? req.target : "/");
		}

		getLoginUrl() {
			return null;
		}
	}

	return AdminAuthenticator;
};
