const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Achat extends Model {
		async getClient() {
			const Client = require("./Client")(sequelize);
			return await Client.findByPk(this.ClientId);
		}
	}

	Achat.init(
		{
			code: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			date: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			total: {
				type: DataTypes.FLOAT(12, 2),
				allowNull: false,
				defaultValue: 0,
			},
			ClientId: {
				field: "id_client",
				type: DataTypes.INTEGER,
				references: {
					model: "Client",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
		},
		{
			sequelize,
			modelName: "Achat",
			tableName: "achat",
			timestamps: false,
			underscored: true,
		}
	);

	Achat.associate = (models) => {
		Achat.hasMany(models.Detail, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "code_achat",
				allowNull: false,
			},
		});

		Achat.belongsTo(models.Magasin, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "code_magasin",
				allowNull: true,
			},
		});

		Achat.belongsTo(models.Client, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_client",
				allowNull: false,
			},
			as: {
				singular: "achat",
				plural: "achats",
			},
		});
	};

	return Achat;
};
