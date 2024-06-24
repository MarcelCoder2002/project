const { DataTypes, Model } = require("sequelize");

class Produit extends Model {}

Produit.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	nom: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	ean_1: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	ean_2: {
		type: DataTypes.STRING,
		allowNull: true,
		unique: true,
	},
});
