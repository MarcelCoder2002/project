const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class PanierEcommerce extends Model {
		async getProduit(options = {}) {
			return await this.sequelize
				.model("Produit")
				.findByPk(this.produit, options);
		}
	}

	PanierEcommerce.init(
		{
			quantite: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			produit: {
				field: "id_produit",
				type: DataTypes.INTEGER,
				references: {
					model: "Produit",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			client: {
				field: "id_client",
				type: DataTypes.INTEGER,
				references: {
					model: "Client",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
		},
		{
			sequelize,
			modelName: "PanierEcommerce",
			tableName: "panier_ecommerce",
			timestamps: false,
			underscored: true,
			hooks: {
				beforeCreate: async (detail, options) => {
					const existing = await PanierEcommerce.findOne({
						where: {
							produit: detail.produit,
							client: detail.client,
						},
					});
					if (existing) {
						existing.quantite += detail.quantite;
						await existing.save();
						throw new Error("This username is not allowed.");
					}
				},
			},
		}
	);

	return PanierEcommerce;
};
