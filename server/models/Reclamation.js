const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	const Notification = require("./Notification")(sequelize);
	class Reclamation extends Model {
		static STATUT = {
			EN_ATTENTE: "En attente",
			TRAITE: "Traité",
		};

		async getClient(options = {}) {
			return await this.sequelize
				.model("Client")
				.findByPk(this.client, options);
		}

		async getMessage(options = {}) {
			options.where = {
				...(options?.where ?? {}),
				reclamation: this.id,
			};
			return await this.sequelize.model("Message").findAll(options);
		}
	}

	Reclamation.init(
		{
			objet: {
				type: DataTypes.STRING(150),
				allowNull: false,
			},
			contenu: {
				type: DataTypes.TEXT,
				allowNull: false,
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
			statut: {
				type: DataTypes.STRING(20),
				allowNull: false,
				values: [
					Reclamation.STATUT.EN_ATTENTE,
					Reclamation.STATUT.TRAITE,
				],
				defaultValue: Reclamation.STATUT.EN_ATTENTE,
			},
			dateCreation: {
				field: "date_creation",
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			dateModification: {
				field: "date_modification",
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: "Reclamation",
			tableName: "Reclamation",
			timestamps: false,
			underscored: true,
			hooks: {
				afterCreate: async (reclamation, options) => {
					Notification.create({
						message:
							"Vous avez une nouvelle réclamation en attente !",
						type: Notification.TYPE.RECLAMATION,
					});
				},
				beforeUpdate: (reclamation, options) => {
					reclamation.dateModification = new Date()
						.toISOString()
						.replace(/T/, " ")
						.replace(/\..+/g, "");
				},
			},
		}
	);

	return Reclamation;
};
