import { body, validationResult } from "express-validator";
import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import { User } from "../models/database.js";
import UserService from "../services/UserService.js";
import ProjectService from "../services/project_service";

const validate =
[
	body("name").not().isEmpty().withMessage("Name cannot be empty"),
	body("email").isEmail().withMessage("Email address is invalid"),
	body("role").isIn(["admin", "project_manager", "risk_manager", "user"]).withMessage("Role is invalid")
];

const userMiddleware = async (request, response, next) =>
{
	request.record = await User.findByPk(request.params.id, { include: "userProjects" });

	if (request.record)
		next();
	else
		response.status(404).send();
};

const validateMiddleware = (create = false) => async (request, response, next) =>
{
	const errors = validationResult(request);
	const projects = await ProjectService.loadAllToSelect();

	if (!errors.isEmpty())
		return response.render("user/edit", { body: request.body, errors: errors.mapped(), create, projects });

	next();
};

const router = express.Router();
router.use(isAuthenticated);
router.use(isAdmin);

router.get("/list", async (request, response) =>
{
	const users = await User.findAll();
	response.render("user/index", { users });
});

router.get("/new", async (request, response) =>
{
	const projects = await ProjectService.loadAllToSelect();
	response.render("user/edit", { body: {}, errors: {}, create: true, projects });
});

router.post("/new",
	...validate,
	body("password").not().isEmpty().withMessage("Password cannot be empty"),
	validateMiddleware(true),
	async (request, response) =>
	{
		await UserService.save(request.body);
		response.redirect("/user/list");
	}
);

router.get("/edit/:id",
	userMiddleware,
	async (request, response) =>
	{
		const projects = await ProjectService.loadAllToSelect();
		const body = request.record.get({ plain: true });
		body.projects = request.record.userProjects.map(project => project.id);

		response.render("user/edit", { body, errors: {}, create: false, projects });
	}
);

router.post("/edit/:id",
	userMiddleware,
	...validate,
	validateMiddleware(),
	async (request, response) =>
	{
		await UserService.save(request.body, request.record);
		response.redirect("/user/list");
	}
);

router.post("/delete/:id",
	userMiddleware,
	async (request, response) =>
	{
		await request.record.destroy();
		response.redirect("/user/list");
	}
);

export default router;
