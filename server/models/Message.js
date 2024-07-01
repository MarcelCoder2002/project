const { DataTypes, Model, Op } = require("sequelize");

module.exports = (sequelize) => {
	const Notification = require("./Notification")(sequelize);
	const Reclamation = require("./Reclamation")(sequelize);

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
			reclamation: {
				field: "id_reclamation",
				type: DataTypes.INTEGER,
				references: {
					model: Reclamation,
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
				afterCreate: async (message, options) => {
					if (options.msg?.dst === "client") {
						Notification.create({
							client: (
								await (
									await message.getReclamation()
								).getClient()
							).id,
							message: "Vous avez un nouveau message !",
							type: Notification.TYPE.MESSAGE,
						});
					} else if (options.msg?.dst === "admin") {
						Notification.create({
							admin: message.admin ?? null,
							message: "Vous avez un nouveau message !",
							type: Notification.TYPE.MESSAGE,
						});
					}
				},
				beforeFind: async (options) => {
					if (
						((options.update && options.update === "true") ||
							(typeof options.update === "boolean" &&
								options.update)) &&
						options.where.reclamation &&
						(options.where.client || options.where.admin)
					) {
						const options_ = {
							where: {
								vue: false,
								reclamation: options.where.reclamation,
							},
						};
						if (options.where.client) {
							options_.where.client = options.where.client;
							await Notification.update(
								{ vue: true },
								{
									where: {
										vue: false,
										type: Notification.TYPE.MESSAGE,
										client: options.where.client,
									},
								}
							);
						} else {
							options_.where.admin = options.where?.admin ?? null;
							await Notification.update(
								{ vue: true },
								{
									where: {
										vue: false,
										type: Notification.TYPE.MESSAGE,
										admin: options.where.admin,
									},
								}
							);
						}
						await Message.update({ vue: true }, options_);
					}
				},
			},
		}
	);

	return Message;
};
