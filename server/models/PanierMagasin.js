const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class PanierMagasin extends Model {}

	PanierMagasin.init(
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
			modelName: "PanierMagasin",
			tableName: "panier_magasin",
			timestamps: false,
			underscored: true,
			hooks: {
				beforeCreate: async (detail, options) => {
					const existing = await PanierMagasin.findOne({
						where: {
							ProduitId: detail.ProduitId,
							ClientId: detail.ClientId,
						},
					});
					if (existing !== null) {
						existing.quantite += detail.quantite;
						await detail.destroy();
					}
				},
			},
		}
	);

	PanierMagasin.associate = (models) => {
		PanierMagasin.belongsTo(models.Client, {
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

		PanierMagasin.belongsTo(models.Produit, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_produit",
				allowNull: false,
			},
		});
	};

	return PanierMagasin;
};
