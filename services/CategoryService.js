import { Category } from "../models/database.js";

export default class CategoryService
{
	static async loadAllCategories() {
		return await Category.findAll();
	}
}
