const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Regle extends Model {
		async getRayons() {
			return await sequelize
				.model("Rayon")
				.findAll({ where: { regle: this.id } });
		}

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

	Regle.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			multiplicite: {
				type: DataTypes.TINYINT,
				allowNull: false,
				defaultValue: 0,
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
			modelName: "Regle",
			tableName: "Regle",
			timestamps: false,
			underscored: true,
			hooks: {
				beforeDestroy: async (regle, options) => {
					for (const rayon of await regle.getRayons()) {
						await rayon.update({ regle: null });
						await rayon.save();
					}
				},
			},
		}
	);

	return Regle;
};
