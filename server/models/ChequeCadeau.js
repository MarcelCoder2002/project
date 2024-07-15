const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class ChequeCadeau extends Model {
		static STATUT = {
			EN_ATTENTE: "En attente",
			RECUPERE: "Récupéré",
			CONSOMME: "Consommé",
			EXPIRE: "Expiré",
		};
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
				allowNull: false,
				defaultValue: () => {
					let a = 1,
						b = new Date();
					let d = new Date(b || new Date()),
						c = d.getMonth();
					d.setFullYear(d.getFullYear() + a);
					if (d.getMonth() != c) {
						d = new Date(d.setDate(d.getDate() - 1));
					}
					return d;
				},
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
			},
		}
	);

	return ChequeCadeau;
};
