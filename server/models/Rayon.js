const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	const Regle = require("./Regle")(sequelize);
	const PromotionRayon = require("./PromotionRayon")(sequelize);

	class Rayon extends Model {
		async createProduit(data = {}, options = {}) {
			data.rayon = this.code;
			return await this.sequelize.model("Produit").create(data, options);
		}

		async createPromotionRayon(data = {}, options = {}) {
			data.rayon = this.code;
			return await PromotionRayon.create(data, options);
		}

		async getPromotionRayon(options = {}) {
			options.where = {
				...(options?.where ?? {}),
				rayon: this.code,
			};
			return await PromotionRayon.findOne(options);
		}

		async getRegle(options = {}) {
			return await Regle.findByPk(this.regle, options);
		}

		async hasPromotion(options = {}) {
			let promotion = await this.getPromotionRayon(options);
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
