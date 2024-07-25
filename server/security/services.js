const { Model } = require("sequelize");
const path = require("path");
const config = require("../config/config.json");
const { verify, JsonWebTokenError } = require("jsonwebtoken");
const { findAuthenticatorFiles, snakeToCamel } = require("../src/utils");
const db = require("../models");

exports.firewallProvider = (req, res, next) => {
	const security = config.security;
	const firewalls = security.firewall;
	const uri = req.originalUrl;
	req.firewall = null;
	for (const firewall in firewalls) {
		const value = firewalls[firewall];
		if (firewall !== "main") {
			if (value.pattern) {
				if (value.pattern.startsWith("^")) {
					if (uri.startsWith(value.pattern.substring(1))) {
						req.firewall = value;
						req.firewall.name = firewall;
						break;
					}
				}
			}
		} else {
			req.firewall = value;
			req.firewall.name = firewall;
			break;
		}
	}
	if (req.firewall && req.firewall.authenticator) {
		findAuthenticatorFiles(path.resolve(".")).forEach((file) => {
			if (file.endsWith(req.firewall.authenticator + ".js")) {
				const Authenticator = require(file)();
				req.firewall.authenticator = new Authenticator();
			}
		});
	}
	next();
};

exports.userProvider = async (req, res, next) => {
	const accessToken = req.header("accessToken");
	req.user = null;
	if (accessToken) {
		try {
			const validToken = verify(
				accessToken,
				config.env.jwt.JWT_SECRET_KEY
			);
			if (validToken) {
				if (req.firewall && req.firewall.provider) {
					const Provider = db[req.firewall.provider];
					if (Provider instanceof Model) {
						req.user = await Provider.findByPk(validToken.id);
						req.user.isAuthenticated = () => {
							return true;
						};
					} else {
						req.user = new Provider(validToken);
						req.user.isAuthenticated = () => {
							return false;
						};
					}
				} else {
					const Provider = db[snakeToCamel(validToken.type)];
					req.user = await Provider.findByPk(validToken.id);
					req.user.isAuthenticated = () => {
						return true;
					};
				}
			}
		} catch (error) {
			if (!error instanceof JsonWebTokenError) {
				throw error;
			}
		}
	}
	next();
};

exports.accessControlChecker = (req, res, next) => {
	const security = config.security;
	const uri = req.originalUrl.split("?")[0];
	const accessControls = security.access_control;
	let isGranted = true;
	let found = false;
	for (const accessControl of accessControls) {
		let path = accessControl.path.trim();
		if (path.startsWith("^")) {
			if (
				`${uri}${path.endsWith("/") ? "/" : ""}`.startsWith(
					path.substring(1)
				)
			) {
				found = true;
				const isPublic = accessControl.roles.includes("PUBLIC_ACCESS");
				const isFullAuth = accessControl.roles.includes(
					"IS_FULLY_AUTHENTICATED"
				);
				if (!isPublic) {
					if (req.user) {
						for (const role of accessControl.roles) {
							if (
								role.startsWith("ROLE_") &&
								!req.user.getRoles().includes(role)
							) {
								res.status(403);
								res.json({
									error:
										"Access denied " + role + " required !",
								});
								isGranted = false;
								break;
							}
						}
						if (
							isGranted &&
							isFullAuth &&
							!req.user.isAuthenticated()
						) {
							res.status(403);
							res.json({
								error: "Access denied !",
							});
							isGranted = false;
						}
					} else {
						res.status(403);
						res.json({
							status: "error",
							message: "Access denied !",
						});
						isGranted = false;
					}
				}
				break;
			}
		}
	}
	if (found && isGranted) {
		next();
	}
};
