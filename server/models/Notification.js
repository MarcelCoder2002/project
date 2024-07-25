const { DataTypes, Model, Op } = require("sequelize");

module.exports = (sequelize) => {
	class Notification extends Model {
		async getClient(options = {}) {
			return await this.sequelize
				.model("Client")
				.findByPk(this.client, options);
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
				allowNull: false,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
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
						options.where.client &&
						options.update &&
						options.update === "true"
					) {
						await Notification.update(
							{ vue: true },
							{
								where: {
									vue: false,
								},
							}
						);
					}
				},
			},
		}
	);

	return Notification;
};
