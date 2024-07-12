const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config.json");
const { Client } = require("../models");

module.exports = () => {
	class ClientAuthenticator {
		async authenticate(req, res, next) {
			const client = await Client.findOne({
				where: { email: req.body.email },
			});
			if (client) {
				if (
					await bcrypt.compare(req.body.motDePasse, client.motDePasse)
				) {
					res.json({
						accessToken: sign(
							{
								id: client.id,
								email: req.body.email,
								type: "client",
							},
							config.env.JWT_SECRET_KEY
						),
					});
				} else {
					res.json({
						status: "error",
						message: "Mot de passe incorrecte !",
					});
				}
			} else {
				res.json({
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

	return ClientAuthenticator;
};
