const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Regle extends Model {
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
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Regle",
			tableName: "regle",
			timestamps: false,
			underscored: true,
		}
	);

	Regle.associate = (models) => {
		Regle.hasMany(models.Rayon, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_regle",
				allowNull: true,
			},
		});
	};

	return Regle;
};
