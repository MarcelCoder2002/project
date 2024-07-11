const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    const Client = require("./Client")(sequelize);
    const Magasin = require("./Magasin")(sequelize);

	class Achat extends Model {
        async createDetail(data = {}) {
            data.achat = this.code;
            return await this.sequelize.model("Detail").create(data);
        }

		async getClient() {
            return await Client.findByPk(this.client);
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
            hooks: {
                beforeSave: (achat, options) => {
                    achat.magasin = achat.magasin === "" ? null : achat.magasin;
                },
			},
        }
    );

	return Achat;
};
