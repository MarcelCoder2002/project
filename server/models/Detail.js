const { DataTypes, Model } = require("sequelize");
const { send } = require("../src/email");

module.exports = (sequelize) => {
	const Produit = require("./Produit")(sequelize);
	const Notification = require("./Notification")(sequelize);

	class Detail extends Model {
		async getAchat(options = {}) {
			return await this.sequelize
				.model("Achat")
				.findByPk(this.achat, options);
		}

		async getProduit(options = {}) {
			return await this.sequelize
				.model("Produit")
				.findByPk(this.produit, options);
		}
	}

	Detail.init(
		{
			quantite: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			point: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			total: {
				type: DataTypes.DECIMAL(12, 2),
				allowNull: false,
				defaultValue: 0,
			},
			produit: {
				field: "id_produit",
				type: DataTypes.INTEGER,
				references: {
					model: Produit,
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			achat: {
				field: "code_achat",
				type: DataTypes.INTEGER,
				references: {
					model: "Achat",
					key: "code",
				},
				allowNull: false,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
		},
		{
			sequelize,
			modelName: "Detail",
			tableName: "Detail",
			timestamps: false,
			underscored: true,
			hooks: {
				beforeCreate: async (detail, options) => {
					const produit = await detail.getProduit();
					const achat = await detail.getAchat();
					const client = await achat.getClient();
					// Mise a jour des points et des prix
					if (!(await produit.hasValidPromotion())) {
						// Sans promotion
						const carteFidelite = await client.getCarteFidelite();

						const regle = await (
							await produit.getRayon()
						).getRegle();

						// Calculs
						const total_detail = produit.prix * detail.quantite;
						const total_points =
							total_detail *
							(regle !== null && regle.isValid()
								? regle.multiplicite
								: 1);
						const real_total_points =
							carteFidelite.point +
							carteFidelite.reste +
							total_points;

						// Mise a jour des points et du prix du detail
						detail.total = total_detail;
						detail.point = parseInt(total_points.toString());

						// Mise a jour du total de l'achat
						achat.total += detail.total;
						await achat.save();

						// Mise a jour de la carte de fidelite
						carteFidelite.point = parseInt(
							real_total_points.toString()
						);
						carteFidelite.reste =
							real_total_points - carteFidelite.point;
						await carteFidelite.save();

						// Ajout du cheque cadeau
						const plafond = 10_000;
						if (carteFidelite.point >= plafond) {
							const n = Math.floor(carteFidelite.point / plafond);
							carteFidelite.point = carteFidelite.point % plafond;
							await carteFidelite.save();
							for (let i = 0; i < n; i++) {
								await client.createChequeCadeau({});
							}
							let text = `Vous avez reçu ${n} nouveau${
								n === 1 ? " chèque cadeau" : "x chèques cadeaux"
							} !`;
							try {
								if (client.email) {
									send({
										from: "admin@gmail.com",
										to: client.email,
										subject:
											"Notification de chèque cadeau",
										html: `<h1>Notification</h1><h2>Chèque cadeau</h2><p>${text} Vous pourrez venir le${
											n === 1 ? "" : "s"
										} récupérer dans l'une de nos agences !</p>`,
									});
								}
							} catch (error) {}

							client.createNotification({
								message: text,
								type: Notification.TYPE.CHEQUE_CADEAU,
							});
						}
					} else {
						// Avec promotion
						let promotion = await produit.getPromotion();

						// Mise a jour des points et du prix du detail
						detail.total =
							(produit.prix -
								(produit.prix * promotion.pourcentage) / 100) *
							detail.quantite;

						// Mise a jour du total de l'achat
						achat.total += detail.total;
						await achat.save();
					}
				},
			},
		}
	);

	return Detail;
};
