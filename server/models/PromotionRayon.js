const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class PromotionRayon extends Model {
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

	PromotionRayon.init(
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
			rayon: {
				field: "code_rayon",
				type: DataTypes.INTEGER,
				references: {
					model: "Rayon",
					key: "code",
				},
				allowNull: false,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
		},
		{
			sequelize,
			modelName: "PromotionRayon",
			tableName: "PromotionRayon",
			timestamps: false,
			underscored: true,
		}
	);

	PromotionRayon.associate = (models) => {
		PromotionRayon.belongsTo(models.Rayon, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "code_rayon",
				allowNull: false,
			},
			as: {
				singular: "promotion",
				plural: "promotions",
			},
		});
	};

	return PromotionRayon;
};
