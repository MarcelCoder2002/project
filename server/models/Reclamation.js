const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Reclamation extends Model {}

	Reclamation.init(
		{
			objet: {
				type: DataTypes.STRING(150),
				allowNull: false,
			},
			contenu: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Reclamation",
			tableName: "reclamation",
			timestamps: false,
			underscored: true,
		}
	);

	Reclamation.associate = (models) => {
		Reclamation.belongsTo(models.Client, {
			foreignKey: {
				field: "id_client",
				allowNull: false,
			},
			as: {
				singular: "reclamation",
				plural: "reclamations",
			},
		});
	};

	return Reclamation;
};
