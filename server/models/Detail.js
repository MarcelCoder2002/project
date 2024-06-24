const { DataTypes, Model } = require("sequelize");

class Detail extends Model {}

Detail.init({
	quantite: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1,
	},
	point: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},
});
