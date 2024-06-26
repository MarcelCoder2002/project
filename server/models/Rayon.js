const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Rayon extends Model {
		async getPromotionRayon() {
			const PromotionRayon = require("./PromotionRayon")(sequelize);
			return await PromotionRayon.findOne({
				where: { code_rayon: this.code },
			});
		}

		async getRegle() {
			const Regle = require("./Regle")(sequelize);
			return await Regle.findOne({ where: { id: this.RegleId } });
		}

		async hasPromotion() {
			let promotion = await this.getPromotionRayon();
			return promotion.pourcentage > 0 && promotion.isValid();
		}
	}

	Rayon.init(
		{
			code: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			nom: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			RegleId: {
				field: "id_regle",
				type: DataTypes.INTEGER,
				references: {
					model: "Regle",
					key: "id",
				},
				allowNull: true,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
		},
		{
			sequelize,
			modelName: "Rayon",
			tableName: "rayon",
			timestamps: false,
			underscored: true,
			hooks: {
				afterSave: (rayon, options) => {
					rayon.createPromotionRayon({});
				},
			},
		}
	);

	Rayon.associate = (models) => {
		Rayon.hasMany(models.Produit, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "code_rayon",
				allowNull: false,
			},
		});

		Rayon.hasOne(models.PromotionRayon, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "code_rayon",
				allowNull: false,
			},
		});

		Rayon.belongsTo(models.Regle, {
			foreignKey: {
				field: "id_regle",
				allowNull: true,
			},
			as: {
				singular: "rayon",
				plural: "rayons",
			},
		});
	};

	return Rayon;
};
