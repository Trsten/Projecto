import { Risk, Category, Project, User } from "../models/database.js";
import { Sequelize } from "sequelize";

export default class RiskService
{
	static async loadRisks(id) {
		return await Risk.findAll({
			include: [{model: Category, as: "category"}],
			where: { "project_id": id }
		});
	}

	static async loadFilteredRisks(id, query) {
		const where = {};

		if (query.name) {
			where.name = {
				[Sequelize.Op.like]: `%${query.name}%`,
			};
		}
		if (query.category) {
			where["category_id"] = query.category;
		}

		if (query.minImpact) {
			where.impact = {
				[Sequelize.Op.gte]: query.minImpact,
				[Sequelize.Op.lte]: query.maxImpact
			};
			where.probability = {
				[Sequelize.Op.gte]: query.minProbability/100,
				[Sequelize.Op.lte]: query.maxProbability/100
			};
		}

		where["project_id"] = id;

		if (  query.from && query.to ) {
			where[query.selected] = {
				[Sequelize.Op.gte]: query.from + " 00:00:00Z",
				[Sequelize.Op.lte]: query.to + " 23:59:59Z"
			}; 
		} else if ( query.to  ) {
			where[query.selected] = {
				[Sequelize.Op.lte]: query.to + " 23:59:59Z"
			}; 
		} else if ( query.from ) {
			where[query.selected] = {
				[Sequelize.Op.gte]: query.from + " 00:00:00Z"
			}; 
		}

		if ( query.id ) {
			where["id"] = query.id;  
		}

		return await Risk.findAll({
			where,
			include: [{model: Category, as: "category"}]
		});
	}

	static async loadRiskById(id) {
		return await Risk.findAll({
			include: [
				{model: Category, as: "category"},
				{model: Project, as: "project"},
				{model: User, as: "user"}],
			where: { "id": id }
		});
	}
}
