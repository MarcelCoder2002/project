const bcrypt = require("bcrypt");
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class Client extends Model {
		async getCarteFidelite() {
			const CarteFidelite = require("./CarteFidelite")(sequelize);
			return await CarteFidelite.findOne({
				where: { id_client: this.id },
			});
		}

		async validatePanier() {
			return (await this.validatePanierMagasin())
				? true
				: await this.validatePanierEcommerce();
		}

		async validatePanierEcommerce() {
			const PanierEcommerce = require("./PanierEcommerce")(sequelize);
			let details = await PanierEcommerce.findAll({
				where: { id_client: this.id },
			});
			if (details) {
				const achat = await this.createAchat({});
				for (let detail of details) {
					await achat.createDetail({
						ProduitId: detail.ProduitId,
						quantite: detail.quantite,
					});
					await detail.destroy();
				}
				return true;
			}
			return false;
		}

		async validatePanierMagasin() {
			const PanierMagasin = require("./PanierMagasin")(sequelize);
			let details = await PanierMagasin.findAll({
				where: { id_client: this.id },
			});
			if (details) {
				const achat = await this.createAchat({});
				for (let detail of details) {
					achat.createDetail({
						ProduitId: detail.ProduitId,
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
				afterSave: (client, options) => {
					client.createCarteFidelite({});
				},
			},
		}
	);

	Client.associate = (models) => {
		Client.hasMany(models.Reclamation, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_client",
				allowNull: false,
			},
		});
		Client.hasMany(models.ChequeCadeau, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_client",
				allowNull: false,
			},
		});
		Client.hasMany(models.Achat, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_client",
				allowNull: false,
			},
		});
		Client.hasMany(models.PanierEcommerce, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_client",
				allowNull: false,
			},
		});
		Client.hasMany(models.PanierMagasin, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_client",
				allowNull: false,
			},
		});
		Client.hasOne(models.CarteFidelite, {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			foreignKey: {
				field: "id_client",
				allowNull: false,
			},
		});
	};

	return Client;
};
