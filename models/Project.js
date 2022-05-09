import sequelize from "sequelize";
const { DataTypes } = sequelize;

const Project = (database) => database.define("project", {
	id: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true, autoIncrement: true},
	name: {type: DataTypes.TEXT("tiny"), allowNull: false},
	projectManagerId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false},
	riskManagerId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: true},
	description: {type: DataTypes.TEXT, allowNull: false},
	status: {type: DataTypes.ENUM("active", "archived"), allowNull: false, defaultValue: "active"},
}, {
	underscored: true
});

export default Project;
