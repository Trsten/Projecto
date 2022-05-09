import User from "../../models/User.js";

test("user has correct columns", () =>
{
	// ararnge
	let args = null;
	const database = { define: (...actualArgs) => { args = actualArgs; } };

	// act
	User(database);

	// assert
	expect(args).not.toBe(null);
	expect(args.length).toBe(3);
	expect(args[0]).toBe("user");
	expect(args[1].id).toBeDefined();
	expect(args[1].name).toBeDefined();
	expect(args[1].email).toBeDefined();
	expect(args[1].password).toBeDefined();
	expect(args[1].role).toBeDefined();
});
