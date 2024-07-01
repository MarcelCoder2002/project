const { DataTypes, Model, Op } = require("sequelize");

module.exports = (sequelize) => {
	class Notification extends Model {
		static TYPE = {
			MESSAGE: "Message",
			CHEQUE_CADEAU: "Chèque cadeau",
			RECLAMATION: "Réclamation",
		};

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
	}

	Notification.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			message: {
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
				allowNull: true,
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
				allowNull: true,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			type: {
				type: DataTypes.STRING(20),
				allowNull: false,
				values: [
					Notification.TYPE.CHEQUE_CADEAU,
					Notification.TYPE.MESSAGE,
					Notification.TYPE.RECLAMATION,
				],
			},
		},
		{
			sequelize,
			modelName: "Notification",
			tableName: "notification",
			timestamps: false,
			underscored: true,
			hooks: {
				beforeFind: async (options) => {
					if (
						((options.update && options.update === "true") ||
							(typeof options.update === "boolean" &&
								options.update)) &&
						(options.where.client || options.where.client === null)
					) {
						const options_ = { where: { vue: false } };
						options_.where.client = options.where.client;
						await Notification.update({ vue: true }, options_);
					}
				},
			},
		}
	);

	return Notification;
};
