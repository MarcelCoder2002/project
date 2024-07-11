const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
	class CarteFidelite extends Model {}

	CarteFidelite.init(
		{
			code: {
				type: DataTypes.STRING(13),
				primaryKey: true,
				allowNull: false,
				defaultValue: () => {
					return new Date().valueOf().toString();
				},
			},
			point: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			reste: {
				type: DataTypes.FLOAT(3, 2),
				allowNull: false,
				defaultValue: 0.0,
				validate: {
					min: 0.0,
					max: 0.99,
				},
			},
            client: {
                field: "id_client",
                type: DataTypes.INTEGER,
                references: {
                    model: "Client",
                    key: "id",
                },
                allowNull: false,
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
		},
		{
			sequelize,
			modelName: "CarteFidelite",
			tableName: "carte_fidelite",
			timestamps: false,
			underscored: true,
		}
	);

	return CarteFidelite;
};
