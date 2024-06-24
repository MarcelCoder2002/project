const { DataTypes, Model } = require("sequelize");

class Magasin extends Model {}

Magasin.init({
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
});
