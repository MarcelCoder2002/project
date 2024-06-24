const { DataTypes, Model } = require("sequelize");

class Rayon extends Model {}

Rayon.init({
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
});
