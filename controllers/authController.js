const User = require("../models/User.js");
const Role = require("../models/Role.js");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id, role) => {
	const payload = {
		id,
		role,
	};
	return jwt.sign(payload, process.env.SECRET, {expiresIn: "24h"});
};

class authController {
	async registration(req, res) {
		try {
			const result = validationResult(req);
			if (!result.isEmpty()) {
				return res.status(400).json({message: "Ошибка при регистрации"});
			}
			const {username, password} = req.body;
			const condidate = await User.findOne({username});
			if (condidate) {
				res.status(400).json({message: "Такой user уже существует"});
			}
			const hashPassword = bcrypt.hashSync(password, 7);
			const role = await Role.findOne({value: "ADMIN"});
			const user = new User({username, password: hashPassword, roles: [role.value]});
			await user.save();
			return res.json({message: "Пользователь успешно зарегестрирован"});
		} catch (e) {
			console.log(e);
			res.status(400).json({message: "Error registration"});
		}
	}

	async login(req, res) {
		try {
			const {username, password} = req.body;
			const user = await User.findOne({username});
			if (!user) {
				return res.status(400).json({message: "Пользователь не найден"});
			}
			const validPassword = bcrypt.compareSync(password, user.password);
			if (!validPassword) {
				return res.status(400).json({message: "Не правильный пароль"});
			}
			const token = generateAccessToken(user._id, user.roles);
			return res.json({token});
		} catch (e) {
			res.status(400).json({message: "Error registration"});
		}
	}

	async getUsers(req, res) {
		try {
			const users = await User.find();

			res.json(users);
		} catch (e) {
			res.status(400).json({message: "Error registration"});
		}
	}
}

module.exports = new authController();
