const { DataTypes, Model, Op } = require("sequelize");

module.exports = (sequelize) => {
	class Message extends Model {
		async getClient(options = {}) {
			return await this.sequelize
				.model("Client")
				.findByPk(this.client, options);
		}

		async getAdmin(options = {}) {
			return await this.sequelize
				.model("Admin")
				.findByPk(this.admin, options);
		}

		async getReclamation(options = {}) {
			return await this.sequelize
				.model("Reclamation")
				.findByPk(this.reclamation, options);
		}
	}

	Message.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			contenu: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			vue: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			dateCreation: {
				field: "date_creation",
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
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
			admin: {
				field: "id_admin",
				type: DataTypes.INTEGER,
				references: {
					model: "Admin",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			reclamation: {
				field: "id_reclamation",
				type: DataTypes.INTEGER,
				references: {
					model: "Reclamation",
					key: "id",
				},
				allowNull: false,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
		},
		{
			sequelize,
			modelName: "Message",
			tableName: "message",
			timestamps: false,
			underscored: true,
			hooks: {
				beforeFind: async (options) => {
					if (
						options.where.client &&
						options.update &&
						options.update === "true"
					) {
						await Message.update(
							{ vue: true },
							{
								where: {
									vue: false,
									client: cli,
								},
							}
						);
					}
				},
			},
		}
	);

	return Message;
};
