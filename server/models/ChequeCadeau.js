const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class ChequeCadeau extends Model {
		static STATUT = {
			RECUPERE: "récupéré",
			CONSOMME: "consommé",
			EXPIRE: "expiré",
		};
	}

	ChequeCadeau.init(
		{
			code: {
				type: DataTypes.STRING(13),
				primaryKey: true,
				allowNull: false,
				defaultValue: () => {
					return new Date().valueOf().toString();
				},
			},
			statut: {
				type: DataTypes.STRING,
				allowNull: false,
				values: ["récupéré", "consommé", "expiré"],
				defaultValue: ChequeCadeau.STATUT.RECUPERE,
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
		},
		{
			sequelize,
			modelName: "ChequeCadeau",
			tableName: "cheque_cadeau",
			timestamps: false,
			underscored: true,
		}
	);

	ChequeCadeau.associate = (models) => {
		ChequeCadeau.belongsTo(models.Client, {
			foreignKey: {
				field: "id_client",
				allowNull: false,
			},
			as: {
				singular: "chequeCadeau",
				plural: "chequesCadeau",
			},
		});
	};

	return ChequeCadeau;
};
