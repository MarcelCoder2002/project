const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class PromotionProduit extends Model {
		isIndefinite() {
			let now = new Date();
			return now >= dateDebut && (!this.dateFin || this.dateFin === null);
		}

		isValid() {
			let now = new Date();
			let dateDebut = this.dateDebut;
			let dateFin = this.dateFin ? this.dateFin : null;

			if (now >= dateDebut && (dateFin === null || now <= dateFin)) {
				return true;
			} else {
				return false;
			}
		}
	}

	PromotionProduit.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			pourcentage: {
				type: DataTypes.FLOAT(5, 2),
				allowNull: false,
				defaultValue: 0.0,
				validate: {
					min: 0.0,
					max: 100.0,
				},
			},
			dateDebut: {
				field: "date_debut",
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			dateFin: {
				field: "date_fin",
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "PromotionProduit",
			tableName: "promotion_produit",
			timestamps: false,
			underscored: true,
			hooks: {
				beforeCreate: async () => {},
			},
		}
	);

	PromotionProduit.associate = (models) => {
		PromotionProduit.belongsTo(models.Produit, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_produit",
				allowNull: false,
			},
			as: {
				singular: "promotion",
				plural: "promotions",
			},
		});
	};

	return PromotionProduit;
};
