const http = require("http");
const app = require("./index");

const db = require("./models");

const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};
const port = normalizePort(process.env.PORT || "8000");
app.set("port", port);

const errorHandler = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}
	const address = server.address();
	const bind =
		typeof address === "string" ? "pipe " + address : "port: " + port;
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
	const address = server.address();
	const bind =
		typeof address === "string" ? "pipe " + address : "port " + port;
	console.log("Listening on " + bind);
});

db.sequelize.sync().then(async () => {
    // const rayon = await db.Rayon.create({
    // 	nom: "Cereales",
    // });
    // rayon
    // 	.createProduit({
    // 		nom: "Riz 1Kg",
    // 		prix: 17.95,
    // 	})
    // 	.then((produit) => {
    // 		db.Client.create({
    // 			nom: "Goumou",
    // 			prenom: "Marcel Raymond",
    // 			email: "marcelraymondgoumou@gmail.com",
    // 			motDePasse: "password",
    // 			adresse: "Agadir",
    // 		}).then(async (client) => {
    // 			await client.createPanierEcommerce({
    // 				produit: produit.id,
    // 				quantite: 3,
    // 			});
    // 			await client.validatePanierEcommerce();
    // 		});
    // 	});
    // await db.Admin.create({
    // 	nom: "Admin",
    // 	prenom: "Adminer",
    // 	email: "admin@gmail.com",
    // 	motDePasse: "admin",
    // 	adresse: "Agadir",
    // });
	server.listen(port);
});
