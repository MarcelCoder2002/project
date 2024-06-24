const { DataTypes, Model } = require("sequelize");

class Regle extends Model {}

Regle.init({
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
	multiplicite: {
		type: DataTypes.TINYINT,
		allowNull: false,
		defaultValue: 0,
	},
	date_debut: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: () => {
			return new Date();
		},
	},
	date_fin: {
		type: DataTypes.DATE,
		allowNull: false,
	},
});
