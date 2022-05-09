import { isAuthenticated, isRiskManager } from "../../middlewares/authMiddleware";

test("redirect if not authenticated", () =>
{
	// arrange
	const request = {};

	let redirectTo = null;
	const response = { redirect: url => { redirectTo = url; } };

	let nextCalled = 0;
	const next = () => { nextCalled++; };

	// act
	isAuthenticated(request, response, next);

	// assert
	expect(redirectTo).toBe("/login");
	expect(nextCalled).toBe(0);
});

test("next if authenticated", () =>
{
	// arrange
	const request = { user: {} };

	let redirectTo = null;
	const response = { redirect: url => { redirectTo = url; } };

	let nextCalled = 0;
	const next = () => { nextCalled++; };

	// act
	isAuthenticated(request, response, next);

	// assert
	expect(redirectTo).toBe(null);
	expect(nextCalled).toBe(1);
});

test("403 if not risk manager", () =>
{
	// arrange
	const request = { user: { role: "user" } };

	let sendStatus = null;
	const response = { sendStatus: status => { sendStatus = status; } };

	let nextCalled = 0;
	const next = () => { nextCalled++; };

	// act
	isRiskManager(request, response, next);

	// assert
	expect(sendStatus).toBe(403);
	expect(nextCalled).toBe(0);
});

test("next if risk manager", () =>
{
	// arrange
	const request = { user: { role: "project_manager" } };

	let sendStatus = null;
	const response = { sendStatus: status => { sendStatus = status; } };

	let nextCalled = 0;
	const next = () => { nextCalled++; };

	// act
	isRiskManager(request, response, next);

	// assert
	expect(sendStatus).toBe(null);
	expect(nextCalled).toBe(1);
});
