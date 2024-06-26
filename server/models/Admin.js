const bcrypt = require("bcrypt");
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Admin extends Model {}

	Admin.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			nom: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			prenom: {
				type: DataTypes.STRING(150),
				allowNull: false,
			},
			adresse: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING(200),
				allowNull: false,
				unique: true,
			},
			motDePasse: {
				field: "mot_de_passe",
				type: DataTypes.STRING,
				allowNull: false,
				set(value) {
					this.setDataValue("motDePasse", bcrypt.hashSync(value, 10));
				},
			},
		},
		{
			sequelize,
			modelName: "Admin",
			tableName: "admin",
			timestamps: false,
			underscored: true,
		}
	);

	return Admin;
};
