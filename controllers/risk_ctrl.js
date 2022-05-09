import express from "express";
import CategoryService from "../services/CategoryService.js";
import {body, validationResult} from "express-validator";
import { isRiskManager } from "../middlewares/authMiddleware.js";
import { Risk } from "../models/database.js";




import RiskService from "../services/RiskService.js";

const router = express.Router();

router.get("/", isRiskManager, async function (req, res, next) {
	try {
		const risks = await RiskService.loadRisks();
		res.render("risk/riskList", {
			risks
		});
	} catch (e) {
		next(e);
	}
});


router.get("/detail/:id", async (req, res, next)  => {
	try {
		const risk = await RiskService.loadRiskById(req.params.id);
		const role = req.user.role;
		res.status(risk ? 200 : 404).render("risk/detailRisk",{ risk, role });

	} catch (e) {
		next(e);
	}

});


router.post("/delete", isRiskManager, async (request, response) =>
{
	const risk = await Risk.findByPk(request.body.riskId);

	if (!risk)
		return response.status(404).send();

	const projectId = risk.projectId;
	await risk.destroy();

	return response.redirect("/project/" + projectId);
});

router.get("/new/:id", isRiskManager, async (request, response) => {
	const categories = await CategoryService.loadAllCategories();
	const filtered = {};
	const body = {};
	response.render("risk/createRisk", {projectId: request.params.id, categories, filtered, body});
});

const setRisk = (request, risk) =>
{
	risk.categoryId = request.body.categoryId;
	risk.name = request.body.name;
	risk.description = request.body.description;
	risk.threat = request.body.threat;
	risk.starters = request.body.starters;
	risk.response = request.body.response;
	risk.probability = request.body.probability/100;
	risk.impact = request.body.impact/100;
	risk.status = request.body.status;
	risk.identifiedAt = request.body.identifiedAt || null;
	risk.respondedAt = request.body.respondedAt || null;
};


router.post("/new/:id",
	isRiskManager,
	body(["name"]).isString().isLength({min: 1}),
	body(["impact"]).isFloat({min:0,max:100}),
	body(["probability"]).isFloat({min:0,max:100}),
	async (request, response) =>
	{
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const filtered = Object.fromEntries(
				errors.array().map((item) => [item.param, item.msg])
			);
			const categories = await CategoryService.loadAllCategories();
			const body = request.body;
			response.render("risk/createRisk", {projectId: request.params.id, categories, filtered, body});
		}
		else {
			const risk = new Risk();
			risk.projectId = request.params.id;
			risk.riskManagerId = request.user.id;
			setRisk(request, risk);

			await risk.save();
			response.redirect("/project/"+ risk.projectId);
		}
	});

router.get("/edit/:id", isRiskManager, async (request, response) => {
	const categories = await CategoryService.loadAllCategories();
	const filtered = {};
	const body = await Risk.findByPk(request.params.id);
	response.render("risk/createRisk", {projectId: body.projectId, categories, filtered, body, edit: true});
});

router.post("/edit/:id",
	isRiskManager,
	body(["name"]).isString().isLength({min: 1}),
	body(["impact"]).isFloat({min:0,max:100}),
	body(["probability"]).isFloat({min:0,max:100}),
	async (request, response) =>
	{
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const filtered = Object.fromEntries(
				errors.array().map((item) => [item.param, item.msg])
			);
			const categories = await CategoryService.loadAllCategories();
			const body = request.body;
			response.render("risk/createRisk", {projectId: request.params.id, categories, filtered, body});
		}
		else {
			const risk = await Risk.findByPk(request.params.id);
			setRisk(request, risk);

			await risk.save();
			response.redirect("/project/"+ risk.projectId);
		}
	});

export default router;
