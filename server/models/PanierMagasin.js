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
			modelName: "PanierMagasin",
			tableName: "panier_magasin",
			timestamps: false,
			underscored: true,
			hooks: {
				beforeCreate: async (detail, options) => {
					const existing = await PanierMagasin.findOne({
						where: {
                            produit: detail.produit,
                            client: detail.client,
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

	return PanierMagasin;
};
