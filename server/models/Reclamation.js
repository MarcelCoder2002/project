const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Reclamation extends Model {
		static STATUT = {
			EN_ATTENTE: "En attente",
			TRAITE: "Traité",
		};
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
			reponse: {
				type: DataTypes.TEXT,
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
		},
		{
			sequelize,
			modelName: "Reclamation",
			tableName: "reclamation",
			timestamps: false,
			underscored: true,
			hooks: {
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
