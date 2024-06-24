const { DataTypes, Model } = require("sequelize");

class Achat extends Model {}

Achat.init({
	code: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	date: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: () => {
			return new Date();
		},
	},
});
