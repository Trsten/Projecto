import sequelize from "sequelize";
const { DataTypes } = sequelize;

const Category = (database) => database.define("category", {
	id: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true, autoIncrement: true},
	name: {type: DataTypes.TEXT("tiny"), allowNull: false},
}, {
	underscored: true,
	timestamps: false
});

export default Category;
