require("dotenv").config();

const express = require("express");
const PORT = process.env.PORT || 5500;
const app = express();
const mongoose = require("mongoose");
const authController = require("./controllers/authController");
const {check} = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

app.use(express.json());

app.get("/auth/getUsers", [authMiddleware, roleMiddleware(["ADMIN"])], authController.getUsers);
app.post(
	"/auth/registration",
	[
		check("username", "Имя пользователя не должно быть пустым").notEmpty(),
		check("password", "Пароль должен быть больще 4 и меньше 10").isLength({min: 4, max: 10}),
	],
	authController.registration
);
app.post("/auth/login", authController.login);

async function start() {
	try {
		await mongoose.connect(
			"mongodb+srv://popka:popka@cluster0.8vvluiv.mongodb.net/simple_auth?retryWrites=true&w=majority&appName=Cluster0"
		);

		app.listen(PORT, () => {
			console.log("SERVER WORK ON PORT: " + PORT);
		});
	} catch (e) {
		console.log(e);
	}
}

start();
