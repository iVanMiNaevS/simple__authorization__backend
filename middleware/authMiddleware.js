const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
	if (req.method === "OPTIONS") {
		next();
	}

	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			res.status(400).json({message: "нет токена"});
		}
		const decoded = jwt.verify(token, process.env.SECRET);
		res.user = decoded;
		next();
	} catch (error) {
		console.log(error);
		res.status(400).json("Пользователь не авторизован");
	}
};
