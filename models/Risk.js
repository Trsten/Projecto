import sequelize from "sequelize";
const { DataTypes } = sequelize;

const Risk = (database) => database.define("risk", {
	id: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true, autoIncrement: true},
	categoryId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false},
	projectId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false},
	riskManagerId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false},
	name: {type: DataTypes.TEXT("tiny"), allowNull: false},
	description: {type: DataTypes.TEXT, allowNull: false},
	threat: {type: DataTypes.TEXT, allowNull: false},
	starters: {type: DataTypes.TEXT, allowNull: false},
	response: {type: DataTypes.TEXT, allowNull: false},
	probability: {type: DataTypes.FLOAT, allowNull: false},
	impact: {type: DataTypes.FLOAT, allowNull: false},
	status: {type: DataTypes.ENUM("concept","active","closed","deleted","occurred"), allowNull: false, defaultValue: "active"},
	identifiedAt: {type: DataTypes.DATE, allowNull: true},
	statusUpdatedAt: {type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn("NOW")},
	respondedAt: {type: DataTypes.DATE, allowNull: true},
}, {
	underscored: true
});

export default Risk;
