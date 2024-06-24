const { DataTypes, Model } = require("sequelize");

class Promotion extends Model {}

Promotion.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	pourcentage: {
		type: DataTypes.DECIMAL(5, 2),
		allowNull: false,
		defaultValue: 0.0,
		validate: {
			min: 0.0,
			max: 100.0,
		},
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
