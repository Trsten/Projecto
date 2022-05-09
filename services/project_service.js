import db, { Project, User } from "../models/database";
import { Sequelize } from "sequelize";

class ProjectService {
	static async loadProjects(searchOptions, sortOptions) {
		const where = {};

		if (searchOptions.ids) {
			where.id = searchOptions.ids;
		}

		if (searchOptions.status) {
			where.status =
				searchOptions.status === "all"
					? ["archived", "active"]
					: searchOptions.status;
		} else {
			where.status = "active";
		}

		if (searchOptions.name) {
			if (searchOptions.exactMatch) {
				where.name = searchOptions.name;
			} else {
				where.name = {
					[Sequelize.Op.like]: `%${searchOptions.name}%`,
				};
			}
		}
		if (searchOptions.userId) {
			where["risk_manager_id"] = searchOptions.userId;
		}

		if (!sortOptions.sort) {
			sortOptions.sort = "createdAt";
		} 
		if (!sortOptions.sortDir) {
			sortOptions.sortDir = "ASC";
		}

		return await db.models.project.findAll({
			where,
			order: [[sortOptions.sort, sortOptions.sortDir]],
			include: [
				{
					model: db.models.user,
					as: "project_manager",
					attributes: { exclude: ["password"] },
				},
				{
					model: db.models.user,
					as: "risk_manager",
					attributes: { exclude: ["password"] },
				},
			],
		});
	}

	static async loadProjectById(projectId) {
		return await Project.findOne({
			where: {
				id: projectId
			},
			include: [
				{
					model: User,
					as: "project_manager",
					attributes: { exclude: ["password"] },
				},
				{
					model: User,
					as: "risk_manager",
					attributes: { exclude: ["password"] },
				},
			],
		});
	}

	static async loadAllToSelect() {
		const projects = await Project.findAll({attributes: ["id", "name"]});
		return projects.map(project => [project.id, project.name]);
	}
}

export default ProjectService;
