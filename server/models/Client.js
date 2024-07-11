const bcrypt = require("bcrypt");
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Client extends Model {
        getRoles() {
            return ["ROLE_CLIENT"];
        }

        async createAchat(data = {}) {
            data.client = this.id;
            return await this.sequelize.model("Achat").create(data);
        }

        async createPanierEcommerce(data = {}) {
            data.client = this.id;
            return await this.sequelize.model("PanierEcommerce").create(data);
        }

        async createCarteFidelite(data = {}) {
            data.client = this.id;
            return await this.sequelize.model("CarteFidelite").create(data);
        }

		async getCarteFidelite() {
            return await this.sequelize.model("CarteFidelite").findOne({
                where: {client: this.id},
			});
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
                    where: {client: this.id},
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
                where: {client: this.id},
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
                    console.log(options);
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
