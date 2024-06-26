const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class PanierEcommerce extends Model {}

	PanierEcommerce.init(
		{
			quantite: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			ProduitId: {
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
							ProduitId: detail.ProduitId,
							ClientId: detail.ClientId,
						},
					});
					if (existing !== null) {
						existing.quantite += detail.quantite;
						detail.destroy();
					}
				},
			},
		}
	);

	PanierEcommerce.associate = (models) => {
		PanierEcommerce.belongsTo(models.Client, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_client",
				allowNull: false,
			},
			as: {
				singular: "panier",
				plural: "paniers",
			},
		});

		PanierEcommerce.belongsTo(models.Produit, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_produit",
				allowNull: false,
			},
		});
	};

	return PanierEcommerce;
};
