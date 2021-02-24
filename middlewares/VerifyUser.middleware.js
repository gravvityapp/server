const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const handleMessage = require("../utils/MessageHandler");
const { JWT_SECRET } = process.env;

const verifyToken = async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		const errorObject = handleMessage("NOT_LOGGED_IN", null);
		return res.status(errorObject.status).json(errorObject);
	}

	const token = authorization.replace("Bearer ", "");
	if (!token) {
		const errorObject = handleMessage("NOT_LOGGED_IN", null);
		return res.status(errorObject.status).json(errorObject);
	}

	jwt.verify(token, JWT_SECRET, async (err, payload) => {
		if (err) {
			const errorObject = handleMessage("NOT_LOGGED_IN", null);
			return res.status(errorObject.status).json(errorObject);
		}

		const { googleId } = payload;
		const fetchedUser = await Users.findOne({ googleId });
		try {
			req.user = fetchedUser;
			next();
		} catch (err) {
			const errorObject = handleMessage("INTERNAL_SERVER_ERROR", null);
			return res.status(errorObject.status).json(errorObject);
		}
	});
};

module.exports = { verifyToken };
