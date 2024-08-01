const http = require("http");
const app = require("./index");

const db = require("./models");
const config = require("./config/config.json");

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
const port = normalizePort(process.env.PORT || (config.server?.port ?? false));
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
		typeof address === "string"
			? "pipe " + address
			: `port ${address.port} (at ${address.address})`;
	console.log("Listening on " + bind);
});
server.on("request", (req, res) => {
	console.log(`Request: ${req.method} ${req.url}`);
});

db.sequelize.sync().then(async () => {
	if (! await db.Admin.findByPk(1)) {
		await db.Admin.create({
			nom: "Admin",
			prenom: "Adminer",
			email: "admin@gmail.com",
			motDePasse: "admin",
			adresse: "Agadir",
		});
	
		await db.Client.create(
			{
				nom: "Goumou",
				prenom: "Marcel Raymond",
				email: "mrg@gmail.com",
				motDePasse: "pass",
				adresse: "Agadir",
			},
			{
				$dependencies: {
					carte_fidelite: {
						code: "3850374938464",
					},
				},
			}
		);
	
		const magasin = await db.Magasin.create({
			nom: "Aswak",
			adresse: "Casablanca",
		});
	
		const regle1 = await db.Regle.create({ multiplicite: 2 });
		const regle2 = await db.Regle.create({
			multiplicite: 3,
			dateFin: new Date(),
		});
	
		const rayon1 = await db.Rayon.create(
			{
				nom: "Cereales",
				regle: regle1.id,
			},
			{ $dependencies: { promotion_rayon: { pourcentage: 10 } } }
		);
		await rayon1.createProduit({
			nom: "Riz 1kg",
			prix: 17.95,
			ean1: "4384038309498",
		});
		await rayon1.createProduit({
			nom: "Pâtes 500g",
			prix: 14.95,
		});
	
		const rayon2 = await db.Rayon.create({
			nom: "Jeux",
			regle: regle1.id,
		});
		await rayon2.createProduit({
			nom: "PS4",
			prix: 2999.99,
			ean1: "1384038309497",
		});
		await rayon2.createProduit(
			{
				nom: "Fifa 23",
				prix: 700.99,
			},
			{ $dependencies: { promotion_produit: { pourcentage: 10 } } }
		);
	
		const rayon3 = await db.Rayon.create({
			nom: "Laiterie",
			regle: regle2.id,
		});
		await rayon3.createProduit({
			nom: "Raib du bled",
			prix: 10.99,
			ean1: "0384038309497",
		});
		await rayon3.createProduit({
			nom: "Perly",
			prix: 3,
		});
		await rayon3.createProduit({
			nom: "Danone",
			prix: 2.5,
			ean1: "0388036309497",
		});
	}
	server.listen(port, config.server?.host ?? "localhost");
});
