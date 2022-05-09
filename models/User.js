import sequelize from "sequelize";
const { DataTypes } = sequelize;

const User = (database) => database.define("user", {
	id: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false, primaryKey: true, autoIncrement: true},
	name: {type: DataTypes.TEXT("tiny"), allowNull: false},
	email: {type: DataTypes.TEXT("tiny"), allowNull: false},
	password: {type: DataTypes.TEXT("tiny"), allowNull: false},
	role: {type: DataTypes.ENUM("admin", "risk_manager", "project_manager", "user"), allowNull: false}
}, {
	underscored: true
});

export default User;
