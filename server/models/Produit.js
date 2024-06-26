const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	const Rayon = require("./Rayon")(sequelize);

	class Produit extends Model {
		async getRayon() {
			return await Rayon.findByPk(this.RayonCode);
		}

		async getPromotionRayon() {
			return await (await this.getRayon()).getPromotionRayon();
		}

		async getPromotion() {
			let rayon = await this.getRayon();
			if (await rayon.hasPromotion()) {
				return await rayon.getPromotionRayon();
			} else if (await this.hasPromotion()) {
				return await this.getPromotionProduit();
			} else {
				return null;
			}
		}

		async hasValidPromotion() {
			let valid = await (await this.getRayon()).hasPromotion();
			return valid ? valid : await this.hasPromotion();
		}

		async hasPromotion() {
			let promotion = await this.getPromotionProduit();
			return promotion.pourcentage > 0 && promotion.isValid();
		}
	}

	Produit.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			nom: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			prix: {
				type: DataTypes.FLOAT(12, 2),
				allowNull: false,
			},
			ean1: {
				field: "ean_1",
				type: DataTypes.STRING(13),
				allowNull: false,
				unique: true,
				defaultValue: () => {
					return new Date().valueOf().toString();
				},
			},
			ean2: {
				field: "ean_2",
				type: DataTypes.STRING(13),
				allowNull: true,
				unique: true,
			},
		},
		{
			sequelize,
			modelName: "Produit",
			tableName: "produit",
			timestamps: false,
			underscored: true,
			hooks: {
				afterSave: (produit, options) => {
					produit.createPromotionProduit({});
				},
			},
		}
	);

	Produit.associate = (models) => {
		Produit.hasMany(models.Detail, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_produit",
				allowNull: false,
			},
		});

		Produit.hasOne(models.PromotionProduit, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_produit",
				allowNull: false,
			},
		});

		Produit.belongsTo(models.Rayon, {
			foreignKey: {
				field: "code_rayon",
				allowNull: false,
			},
			as: {
				singular: "produit",
				plural: "produits",
			},
		});
	};

	return Produit;
};
