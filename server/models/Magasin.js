const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Magasin extends Model {}

	Magasin.init(
		{
			code: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			nom: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			adresse: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Magasin",
			tableName: "magasin",
			timestamps: false,
			underscored: true,
		}
	);

	return Magasin;
};
