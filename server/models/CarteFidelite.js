const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class CarteFidelite extends Model {
		async getClient(options = {}) {
			return await this.sequelize
				.model("Client")
				.findByPk(this.client, options);
		}
	}

	CarteFidelite.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			code: {
				type: DataTypes.STRING(13),
				allowNull: true,
				unique: true,
			},
			point: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: 0,
				},
			},
			reste: {
				type: DataTypes.FLOAT(3, 2),
				allowNull: false,
				defaultValue: 0.0,
				validate: {
					min: 0.0,
					max: 0.99,
				},
			},
			client: {
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
			modelName: "CarteFidelite",
			tableName: "CarteFidelite",
			timestamps: false,
			underscored: true,
		}
	);

	return CarteFidelite;
};
