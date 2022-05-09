import Sequelize from "sequelize";
import User from "./User.js";
import Category from "./Category.js";
import Project from "./Project.js";
import Risk from "./Risk.js";


const relations = (database) => {
	const { user, category, project, risk } = database.models;
	user.hasMany(project, {foreignKey: "project_manager_id"});
	user.hasMany(project, {foreignKey: "risk_manager_id"});
	user.hasMany(risk, {foreignKey: "risk_manager_id"});
	project.belongsTo(user, {
		as: "project_manager",
	});
	project.belongsTo(user, {
		as: "risk_manager",
	});
	project.hasMany(risk, {foreignKey: "project_id"});
	risk.belongsTo(category, {
		as: "category",
	});
	risk.belongsTo(user, {foreignKey: "risk_manager_id"});
	risk.belongsTo(project);
	category.hasMany(risk, {foreignKey: "category_id"});
	user.belongsToMany(project, {through: "user_projects", as: "userProjects"});
	project.belongsToMany(user, {through: "user_projects"});
};

const registerModels = (models, database) => {
	for (const item of models)
		item(database);
};

const database = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: "mysql"
});

registerModels([
	User,
	Category,
	Project,
	Risk
], database);

relations(database);

const UserProject = database.models.user_projects;
const {
	category,
	project,
	risk,
	user
} = database.models;

export {
	category as Category,
	project as Project,
	risk as Risk,
	user as User,
	UserProject
};

export default database;
