import bodyParser from "body-parser";
import express from "express";
import session from "express-session";

import database from "./models/database.js";
import SequelizeStoreFactory from "connect-session-sequelize";
const SequelizeStore = SequelizeStoreFactory(session.Store);
const store = new SequelizeStore({
	db: database,
	tableName: "sessions"
});
store.sync();

// controllers
import authCtrl from "./controllers/auth_ctrl.js";
import userCtrl from "./controllers/user_ctrl.js";
import projectCtrl from "./controllers/project_ctrl.js";
import riskCtrl from "./controllers/risk_ctrl.js";

// middlewares
import authMiddleware, { isAuthenticated } from "./middlewares/authMiddleware.js";


async function createApp() {
	const app = express();
	await database.authenticate();
	app.set("view engine", "ejs");

	app.use(session({
		secret: process.env.SECRET,
		store,
		resave: false,
		saveUninitialized: true
	}));

	app.use(authMiddleware);
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.static("public"));

	app.use("/", authCtrl);

	app.use(isAuthenticated);
	app.get("/", function (req, res) {
		res.redirect("/project/list");
	});

	app.use("/user", userCtrl);
	app.use("/project", projectCtrl);
	app.use("/risk", riskCtrl);

	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`App has started on port ${port}!`);
	});
}

createApp()
	.then(() => {})
	.catch((e) => console.error(e));
