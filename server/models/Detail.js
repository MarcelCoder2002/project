const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Detail extends Model {
		async getAchat() {
			return await sequelize.models.Achat.findByPk(this.AchatCode);
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
		},
		{
			sequelize,
			modelName: "Detail",
			tableName: "detail",
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
						const total_detail =
							produit.prix *
							detail.quantite *
							(regle !== null && regle.isValid()
								? regle.multiplicite
								: 1);
						const real_total_points =
							carteFidelite.point +
							carteFidelite.reste +
							total_detail;

						// Mise a jour des points et du prix du detail
						detail.total = total_detail;
						detail.point = parseInt(total_detail.toString());

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
							carteFidelite.point -= plafond;
							await carteFidelite.save();
							await client.createChequeCadeau({});
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

	Detail.associate = (models) => {
		Detail.belongsTo(models.Achat, {
			foreignKey: {
				field: "code_achat",
				allowNull: false,
			},
			as: {
				singular: "detail",
				plural: "details",
			},
		});

		Detail.belongsTo(models.Produit, {
			foreignKey: {
				field: "id_produit",
				allowNull: false,
			},
		});
	};

	return Detail;
};
