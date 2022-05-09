import bcrypt from "bcrypt";
import express from "express";
import { User } from "../models/database.js";

const router = express.Router();
router.get("/login", (request, response) =>
{
	if (request.session.userId)
		return response.redirect("/");

	response.render("auth/login", { body: {}, errors: {} });
});

router.post("/login", async (request, response) =>
{
	const { email, password } = request.body;
	const user = await User.findOne({ where: { email } });

	if (!user)
		return response.render("auth/login", { body: request.body, errors: { email: { msg: "Email not found" } } });

	if (!await bcrypt.compare(password, user.password))
		return response.render("auth/login", { body: request.body, errors: { password: { msg: "Password is incorrect" } } });

	request.session.userId = user.id;
	request.session.save(() => response.redirect("/"));
});

router.get("/logout", (request, response) =>
{
	delete request.session.userId;
	request.session.save(() => response.redirect("/login"));
});

export default router;
