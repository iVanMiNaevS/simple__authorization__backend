const jwt = require("jsonwebtoken");
module.exports = function roleMiddleware(roles) {
	return function (req, res, next) {
		if (req.method === "OPTIONS") {
			next();
		}

		try {
			const token = req.headers.authorization.split(" ")[1];
			if (!token) {
				res.status(400).json({message: "нет токена"});
			}
			const {role: userRoles} = jwt.verify(token, process.env.SECRET);
			let hasRole = false;
			userRoles.forEach((role) => {
				if (role.includes(roles)) {
					hasRole = true;
				}
			});

			if (!hasRole) {
				res.status(400).json({message: "нет доступа"});
			}
			next();
		} catch (error) {
			console.log(error);
			res.status(400).json("Пользователь не авторизован");
		}
	};
};
