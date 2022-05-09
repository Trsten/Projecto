import {User} from "../models/database.js";
import database from "../models/database.js";
import sequelize from "sequelize";
const { QueryTypes } = sequelize;

const availableRiskManagers = () => {
	return database.query("SELECT `user`.`name`, `user`.`id` FROM `users` AS `user` LEFT OUTER JOIN projects ON `user`.`id` = `projects`.`risk_manager_id` AND `projects`.`status` = 'active' WHERE `user`.`role` = 'risk_manager' GROUP BY `user`.`name` HAVING count(`projects`.`id`) = 0;",{
		model: User,
		mapToModel: true,
		type: QueryTypes.SELECT
	});
};

export default availableRiskManagers;
