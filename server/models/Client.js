const bcrypt = require("bcrypt");
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Client extends Model {
		getFullName() {
			return this.nom + " " + this.prenom;
		}

		getRoles(options = {}) {
			return ["ROLE_CLIENT"];
		}

		async getAchat(options = {}) {
			options.where = {
				...(options?.where ?? {}),
				client: this.id,
			};
			return await this.sequelize.model("Achat").findAll(options);
		}

		async getChequeCadeau(options = {}) {
			options.where = {
				...(options?.where ?? {}),
				client: this.id,
			};
			return await this.sequelize.model("ChequeCadeau").findAll(options);
		}

		async createAchat(data = {}, options = {}) {
			data.client = this.id;
			return await this.sequelize.model("Achat").create(data, options);
		}

		async createChequeCadeau(data = {}, options = {}) {
			data.client = this.id;
			return await this.sequelize
				.model("ChequeCadeau")
				.create(data, options);
		}

		async createPanierEcommerce(data = {}, options = {}) {
			data.client = this.id;
			return await this.sequelize
				.model("PanierEcommerce")
				.create(data, options);
		}

		async createCarteFidelite(data = {}, options = {}) {
			data.client = this.id;
			return await this.sequelize
				.model("CarteFidelite")
				.create(data, options);
		}

		async getCarteFidelite(options = {}) {
			options.where = {
				...(options?.where ?? {}),
				client: this.id,
			};
			return await this.sequelize.model("CarteFidelite").findOne(options);
		}

		async getPanierEcommerce(options = {}) {
			if (options.where) {
				options.where.client = this.id;
			}
			return await this.sequelize
				.model("PanierEcommerce")
				.findAll(options);
		}

		async validatePanier() {
			return (await this.validatePanierMagasin())
				? true
				: await this.validatePanierEcommerce();
		}

		async validatePanierEcommerce() {
			let details = await this.sequelize
				.model("PanierEcommerce")
				.findAll({
					where: { client: this.id },
				});
			if (details) {
				const achat = await this.createAchat({});
				for (let detail of details) {
					await achat.createDetail({
						produit: detail.produit,
						quantite: detail.quantite,
					});
					await detail.destroy();
				}
				return true;
			}
			return false;
		}

		async validatePanierMagasin() {
			let details = await this.sequelize.model("PanierMagasin").findAll({
				where: { client: this.id },
			});
			if (details) {
				const achat = await this.createAchat({});
				for (let detail of details) {
					achat.createDetail({
						produit: detail.produit,
						quantite: detail.quantite,
					});
					detail.destroy();
				}
				return true;
			}
			return false;
		}
	}

	Client.init(
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
			dateCreation: {
				field: "date_creation",
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: "Client",
			tableName: "client",
			timestamps: false,
			underscored: true,
			hooks: {
				afterCreate: async (client, options) => {
					await client.createCarteFidelite(
						options?.$dependencies?.carte_fidelite ?? {}
					);
				},

				beforeUpdate: async (client, options) => {
					const carte_fidelite = await client.getCarteFidelite();
					await carte_fidelite.update(
						options?.$dependencies?.carte_fidelite ?? {}
					);
					await carte_fidelite.save();
				},
			},
		}
	);

	return Client;
};
