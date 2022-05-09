import Risk from "../../models/Risk.js";

test("risk has correct columns", () =>
{
	// ararnge
	let args = null;
	const database = { define: (...actualArgs) => { args = actualArgs; } };

	// act
	Risk(database);

	// assert
	expect(args).not.toBe(null);
	expect(args.length).toBe(3);
	expect(args[0]).toBe("risk");
	expect(args[1].id).toBeDefined();
	expect(args[1].categoryId).toBeDefined();
	expect(args[1].projectId).toBeDefined();
	expect(args[1].riskManagerId).toBeDefined();
	expect(args[1].name).toBeDefined();
	expect(args[1].description).toBeDefined();
	expect(args[1].threat).toBeDefined();
	expect(args[1].starters).toBeDefined();
	expect(args[1].response).toBeDefined();
	expect(args[1].probability).toBeDefined();
	expect(args[1].impact).toBeDefined();
	expect(args[1].status).toBeDefined();
	expect(args[1].identifiedAt).toBeDefined();
	expect(args[1].statusUpdatedAt).toBeDefined();
	expect(args[1].respondedAt).toBeDefined();
});
