import { User } from "../models/database.js";

const authMiddleware = async (request, response, next) =>
{
	const { userId } = request.session;

	if (!userId)
		return next();

	response.locals.user = request.user = await User.findByPk(userId);

	if (request.user)
		return next();

	delete request.session.userId;
	request.session.save(() => response.redirect("/login"));
};

export const isAuthenticated = (request, response, next) =>
{
	if (!request.user)
		return response.redirect("/login");

	next();
};

export const hasAnyRole = (...roles) => (request, response, next) =>
{
	if (!roles.includes(request.user.role))
		return response.sendStatus(403);

	next();
};

export const isAdmin = hasAnyRole("admin");
export const isProjectManager = hasAnyRole("admin", "project_manager");
export const isRiskManager = hasAnyRole("admin", "project_manager", "risk_manager");

export default authMiddleware;
