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

	Magasin.associate = (models) => {
		Magasin.hasMany(models.Achat, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "code_magasin",
				allowNull: true,
			},
		});
	};

	return Magasin;
};
