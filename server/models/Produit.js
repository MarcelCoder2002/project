const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	const Rayon = require("./Rayon")(sequelize);

	class Produit extends Model {
        async createPromotionProduit(data = {}) {
            data.produit = this.id;
            return await this.sequelize.model("PromotionProduit").create(data);
        }

		async getRayon() {
            return await Rayon.findByPk(this.rayon);
		}

		async getPromotionRayon() {
			return await (await this.getRayon()).getPromotionRayon();
		}

        async getPromotionProduit() {
            return await this.sequelize.model("PromotionProduit").findOne({
                where: {
                    produit: this.id,
                },
            });
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
            rayon: {
                field: "code_rayon",
                type: DataTypes.INTEGER,
                references: {
                    model: Rayon,
                    key: "code",
                },
                allowNull: false,
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
		},
		{
			sequelize,
			modelName: "Produit",
			tableName: "produit",
			timestamps: false,
			underscored: true,
			hooks: {
                beforeSave: (produit, options) => {
                    produit.ean2 = produit.ean2 === "" ? null : produit.ean2;
                },

                afterCreate: (produit, options) => {
                    produit.createPromotionProduit(
                        options?.$dependencies?.promotion_produit ?? {}
                    );
                },

                beforeUpdate: async (produit, options) => {
                    const promotion = await produit.getPromotionProduit();
                    await promotion.update(
                        options?.$dependencies?.promotion_produit ?? {}
                    );
                    await promotion.save();
                },
			},
        }
    );

	return Produit;
};
