const { DataTypes, Model, Op } = require("sequelize");

module.exports = (sequelize) => {
	const Notification = require("./Notification")(sequelize);

	class ChequeCadeau extends Model {
		static STATUT = {
			EN_ATTENTE: "En attente",
			RECUPERE: "Récupéré",
			CONSOMME: "Consommé",
			EXPIRE: "Expiré",
		};

		isValid() {
			return (
				this.statut === ChequeCadeau.STATUT.RECUPERE &&
				this.dateExpiration &&
				this.dateExpiration >= new Date()
			);
		}

		async getClient(options = {}) {
			return await this.sequelize
				.model("Client")
				.findByPk(this.client, options);
		}
	}

	ChequeCadeau.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			code: {
				type: DataTypes.STRING(13),
				unique: true,
				allowNull: true,
			},
			statut: {
				type: DataTypes.STRING,
				allowNull: false,
				values: [
					ChequeCadeau.STATUT.EN_ATTENTE,
					ChequeCadeau.STATUT.RECUPERE,
					ChequeCadeau.STATUT.CONSOMME,
					ChequeCadeau.STATUT.EXPIRE,
				],
				defaultValue: ChequeCadeau.STATUT.EN_ATTENTE,
			},
			dateExpiration: {
				field: "date_expiration",
				type: DataTypes.DATE,
				allowNull: true,
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
			modelName: "ChequeCadeau",
			tableName: "cheque_cadeau",
			timestamps: false,
			underscored: true,
			hooks: {
				beforeUpdate: (cheque_cadeau, options) => {
					cheque_cadeau.dateModification = new Date()
						.toISOString()
						.replace(/T/, " ")
						.replace(/\..+/g, "");
				},
				beforeFind: async (options) => {
					if (options.where.client) {
						await ChequeCadeau.update(
							{ statut: ChequeCadeau.STATUT.EXPIRE },
							{
								where: {
									client: options.where.client,
									statut: {
										[Op.in]: [
											ChequeCadeau.STATUT.EN_ATTENTE,
											ChequeCadeau.STATUT.RECUPERE,
										],
									},
									dateExpiration: { [Op.lt]: new Date() },
								},
							}
						);
						await Notification.update(
							{ vue: true },
							{
								where: {
									client: options.where.client,
									vue: false,
									type: Notification.TYPE.CHEQUE_CADEAU,
								},
							}
						);
					}
				},
			},
		}
	);

	return ChequeCadeau;
};
