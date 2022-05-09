import Category from "../../models/Category.js";

test("category has correct columns", () =>
{
	// ararnge
	let args = null;
	const database = { define: (...actualArgs) => { args = actualArgs; } };

	// act
	Category(database);

	// assert
	expect(args).not.toBe(null);
	expect(args.length).toBe(3);
	expect(args[0]).toBe("category");
	expect(args[1].id).toBeDefined();
	expect(args[1].name).toBeDefined();
});
