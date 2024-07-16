const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	const Client = require("./Client")(sequelize);
	const Magasin = require("./Magasin")(sequelize);

	class Achat extends Model {
		async createDetail(data = {}, options = {}) {
			data.achat = this.code;
			return await this.sequelize.model("Detail").create(data, options);
		}

		async getClient(options = {}) {
			return await Client.findByPk(this.client, options);
		}

		async getDetail(options = {}) {
			options.where = {
				...(options?.where ?? {}),
				achat: this.code,
			};
			return await this.sequelize.model("Detail").findAll(options);
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
			client: {
				field: "id_client",
				type: DataTypes.INTEGER,
				references: {
					model: Client,
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			magasin: {
				field: "code_magasin",
				type: DataTypes.INTEGER,
				references: {
					model: Magasin,
					key: "code",
				},
				allowNull: true,
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

	return Achat;
};
