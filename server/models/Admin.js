const bcrypt = require("bcrypt");
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Admin extends Model {
		getRoles() {
			return ["ROLE_ADMIN"];
		}

		getFullName() {
			return this.nom + " " + this.prenom;
		}

		async createNotification(data = {}, options = {}) {
			data.admin = this.id;
			return await this.sequelize
				.model("Notification")
				.create(data, options);
		}

		async getNotification(options = {}) {
			if (options.where) {
				options.where.admin = this.id;
			}
			return await this.sequelize.model("Notification").findAll(options);
		}

		async createMessage(data = {}, options = {}) {
			data.admin = this.id;
			return await this.sequelize.model("Message").create(data, options);
		}

		async getMessage(options = {}) {
			if (options.where) {
				options.where.admin = this.id;
			}
			return await this.sequelize.model("Message").findAll(options);
		}
	}

	Admin.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			nom: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			prenom: {
				type: DataTypes.STRING(150),
				allowNull: false,
			},
			adresse: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING(200),
				allowNull: false,
				unique: true,
			},
			motDePasse: {
				field: "mot_de_passe",
				type: DataTypes.STRING,
				allowNull: false,
				set(value) {
					this.setDataValue("motDePasse", bcrypt.hashSync(value, 10));
				},
			},
		},
		{
			sequelize,
			modelName: "Admin",
			tableName: "Admin",
			timestamps: false,
			underscored: true,
		}
	);

	return Admin;
};
