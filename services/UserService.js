import { User } from "../models/database.js";
import bcrypt from "bcrypt";

export default class UserService
{
	static async hash(password)
	{
		const salt = await bcrypt.genSalt();
		return await bcrypt.hash(password, salt);
	}

	static async save({ name, email, password, role, projects }, user = new User())
	{
		user.name = name;
		user.email = email;
		user.role = role;

		if (password)
			user.password = await this.hash(password);

		if (!user.id)
			await user.save();

		user.setUserProjects(projects);

		return await user.save();
	}
}
