// Temporary file, tries to connect to database and if database exists creates tables

import "dotenv/config.js";
import database from "./models/database.js";

database.sync({force: true})
	.then(() => console.log("finished"))
	.catch(error => console.log(error));
