import express from "express";
import ProjectService from "../services/project_service.js";
import { ROLES } from "../utility.js";
import {body, validationResult} from "express-validator";
import {isProjectManager} from "../middlewares/authMiddleware.js";
import availableRiskManagers from "../services/AvailableRiskManagerService.js";
import { User, Project, UserProject } from "../models/database.js";
import Sequelize from "sequelize";
import RiskService from "../services/RiskService.js";
import CategoryService from "../services/CategoryService.js";
const {Op} = Sequelize;

const AvailableRiskManagerValidator = async (value) => {
	if (value === "0")
		return true;

	const user = await User.findByPk(value);

	if (!user)
		throw "User does not exist";

	if (user.role !== "risk_manager")
		throw "Not risk manager";

	const openProjectCount = await Project.findAndCountAll({
		where: {
			riskManagerId: {[Op.eq]: user.id},
			status: {[Op.eq]: "active"}
		}
	});
	if (openProjectCount.count)
		throw "Risk manager already has projects";
};

const router = express.Router();
router.get("/list", async function (req, res, next) {
	let userId;
	let ids;
	const role = req.user.role;
	if (role === ROLES.RISK_MANAGER) {
		userId = req.user.id;
	} else if (role === "user") {
		const userProjects = await UserProject.findAll({ where: { userId: req.user.id } });
		ids = userProjects.map(userProject => userProject.projectId);
	}
	try {
		const { name, status, exactMatch, sort, sortDir } = req.query;
		const projects = await ProjectService.loadProjects(
			{ name, status, exactMatch, userId, ids },
			{ sort, sortDir }
		);
		const statusCode = projects && projects.length > 0 ? 200 : 404;
		res.status(statusCode).render("project/project_list", {
			projects,
			queryParams: { name, status, exactMatch, sort, sortDir },
			role,
		});
	} catch (e) {
		next(e);
	}
});

router.get("/new", [isProjectManager], async (request, response) => {
	const riskManagers = await availableRiskManagers();
	response.render("newProject", { riskManagers });
});

router.post("/new",
	[isProjectManager],
	body(["name", "name"]).isString().isLength({min: 1}).withMessage("Invalid name"),
	body(["description", "description"]).isString().isLength({min: 1}).withMessage("Invalid description"),
	body(["riskManagerId"]).custom((value) => AvailableRiskManagerValidator(value)),
	async (request, response) => {
		const errors = validationResult(request);
		const { name, riskManagerId, description } = request.body;
		if (!errors.isEmpty()) {
			const filtered = Object.fromEntries(
				errors.array().map((item) => [item.param, item.msg])
			);
			const riskManagers = await availableRiskManagers();
			response.render("newProject", {
				riskManagers,
				filtered,
				name,
				riskManagerId,
				description,
			});
		} else {
			const project = new Project();
			project.name = name;
			project.projectManagerId = request.session.userId;
			project.description = description;
			project.riskManagerId = parseInt(riskManagerId) ? riskManagerId : null;
			await project.save();
			response.redirect("/project/list");
		}
	}
);

router.post("/archive",
	[isProjectManager],
	body("projectId")
		.notEmpty()
		.custom(async (value) => {
			const project = await Project.findByPk(value);

			if (!project) throw "Project does not exist";

			if (project.status === "archived") throw "Project is already archived";
		}),
	async (request, response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			response.status(404).send();
			return;
		}

		const { projectId } = request.body;
		await Project.update({ status: "archived" }, { where: { id: projectId } });
		response.redirect("/project/list");
	}
);

router.get("/available-risk-managers",
	[isProjectManager],
	async (_, response) => {
		const riskManagers = await availableRiskManagers();
		response.setHeader("Content-type", "application/json");
		response.end(JSON.stringify(riskManagers));
	}
);

router.post("/change-manager",
	[isProjectManager],
	body("projectId").notEmpty().custom(async (value) => {
		const project = await Project.findByPk(value);

		if (!project)
			throw "Project does not exist";
	}),
	body(["riskManagerId"]).custom((value) => AvailableRiskManagerValidator(value)),
	async (request, response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty())
		{
			response.status(404).send();
			return;
		}
		const { projectId, riskManagerId } = request.body;
		await Project.update({riskManagerId: riskManagerId === "0" ? null : riskManagerId}, {where: {id: projectId}});
		response.redirect("/project/list");
	}
);

router.get("/risk_chart/:id", async (req, res, next) => {
	try {
		const project = await ProjectService.loadProjectById(req.params.id);
		const risks = await RiskService.loadRisks(req.params.id);

		res.status(project ? 200 : 404).render("project/project_chart", { project, notFound: !project, risks });
	} catch (e) {
		next(e);
	}
});

router.get("/matrix/:id", async (req, res, next) => {
	try {
		const project = await ProjectService.loadProjectById(req.params.id);
		const risks = await RiskService.loadFilteredRisks(req.params.id,req.query);
		const allRisk = await RiskService.loadRisks(req.params.id);

		var matrix = new Array();

		//calculate position in matrix 
		allRisk.forEach(risk => {
			var impact = risk.impact;
			var probability = risk.probability;
			var x = 0;
			var y = 0;
			while( impact >= 0.2 || probability >= 0.2 ) {
				if ( impact >= 0.2 ) {
					x = x == 4 ? 4 : x + 1;
					impact = (impact - 0.2).toFixed(3);
				} 
				if ( probability >= 0.2 ) {
					y = y == 4 ? 4 : y + 1;
					probability = (probability - 0.2).toFixed(3) ;
				} 
			}
			matrix[x*5+y] = matrix[x*5+y] != null ? "(" + (parseInt(matrix[x*5+y].substring(1,matrix[x*5+y].length-1)) + 1) + ")" : "(1)" ;
		});
		res.status(project ? 200 : 404).render("project/project_matrix", { project, notFound: !project, risks, query: req.query, matrix });
	} catch (e) {
		next(e);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const project = await ProjectService.loadProjectById(req.params.id);
		const risks = await RiskService.loadFilteredRisks(req.params.id,req.query);
		const categories = await CategoryService.loadAllCategories();

		res.status(project ? 200 : 404).render("project/project_detail", { risks, project, notFound: !project, query: req.query, categories });

	} catch (e) {
		next(e);
	}
});

export default router;
