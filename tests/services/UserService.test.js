import UserService from "../../services/UserService.js";
import bcrypt from "bcrypt";

const hashRegex = /^\$2b\$10\$.{53}$/;

test("hash password", async () =>
{
	// arrange
	const password = "test";

	// act
	const hash = await UserService.hash(password);

	// assert
	expect(hash).toMatch(hashRegex);
	expect(await bcrypt.compare(password, hash)).toBeTruthy();
});

test("save user with password", async () =>
{
	// arrange
	const name = "my user name";
	const email = "email@of.user";
	const password = "my user password";
	const role = "risk_manager";

	let saved = 0;
	const user = { save: async () => { saved++; } };

	// act
	await UserService.save({ name, email, password, role }, user);

	// assert
	expect(saved).toBe(1);
	expect(user.name).toBe(name);
	expect(user.email).toBe(email);
	expect(user.password).toMatch(hashRegex);
	expect(await bcrypt.compare(password, user.password)).toBeTruthy();
	expect(user.role).toBe(role);
});
