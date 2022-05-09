import Project from "../../models/Project.js";

test("project has correct columns", () =>
{
	// ararnge
	let args = null;
	const database = { define: (...actualArgs) => { args = actualArgs; } };

	// act
	Project(database);

	// assert
	expect(args).not.toBe(null);
	expect(args.length).toBe(3);
	expect(args[0]).toBe("project");
	expect(args[1].id).toBeDefined();
	expect(args[1].name).toBeDefined();
	expect(args[1].projectManagerId).toBeDefined();
	expect(args[1].riskManagerId).toBeDefined();
	expect(args[1].description).toBeDefined();
	expect(args[1].status).toBeDefined();
});
