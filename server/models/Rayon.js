const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    const Regle = require("./Regle")(sequelize);
    const PromotionRayon = require("./PromotionRayon")(sequelize);

	class Rayon extends Model {
        async createProduit(data = {}) {
            data.rayon = this.code;
            return await this.sequelize.model("Produit").create(data);
        }

        async createPromotionRayon(data = {}) {
            data.rayon = this.code;
            return await PromotionRayon.create(data);
        }

		async getPromotionRayon() {
			return await PromotionRayon.findOne({
				where: { code_rayon: this.code },
			});
		}

		async getRegle() {
			const Regle = require("./Regle")(sequelize);
            return await Regle.findByPk(this.regle);
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
            regle: {
				field: "id_regle",
				type: DataTypes.INTEGER,
				references: {
                    model: Regle,
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
                beforeSave: (rayon, options) => {
                    rayon.regle = rayon.regle === "" ? null : rayon.regle;
                },

                afterCreate: (rayon, options) => {
                    rayon.createPromotionRayon(
                        options?.$dependencies?.promotion_rayon ?? {}
                    );
                },

                beforeUpdate: async (rayon, options) => {
                    const promotion = await rayon.getPromotionRayon();
                    await promotion.update(
                        options?.$dependencies?.promotion_rayon ?? {}
                    );
                    await promotion.save();
                },
			},
        }
    );

	return Rayon;
};
