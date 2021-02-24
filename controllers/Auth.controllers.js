const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const handleMessage = require("../utils/MessageHandler");
const { JWT_SECRET } = process.env;

//To Sign JWT Token(used in handleAuth function below)
const signJWT = (googleId) => {
	const token = jwt.sign({ googleId }, JWT_SECRET);
	return token;
};

//Used in the handleAuth function below to break full name into parts
const handleFullName = (fullName) => {
	const partsOfFullName = fullName.split(" ");
	const firstName = partsOfFullName[0].toLowerCase();
	const lastName = partsOfFullName[partsOfFullName.length - 1].toLowerCase();
	return { firstName, lastName };
};

//Used in handleAuth to handle the request according to app or web
const handleRequestsBasedOnPlatform = (token, user, platformType) => {
	platformType = platformType.toLowerCase();

	let payloadObject = {
		user: platformType === "app" ? user : null,
		redirect: platformType === "web" ? true : null,
		token: token,
	};

	return handleMessage("RESOURCE_CREATED", payloadObject);
};

//To handle User signup and login
const handleAuth = async (req, res, next) => {
	const { fullName, googleId, email, platformType } = req.body; //platformType can either be "app" or "web"

	if (!fullName || !googleId || !email || !platformType) {
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null);
		return res.status(errorObj.status).json(errorObj);
	}

	if (platformType !== "app" && platformType !== "web") {
		const errorObj = handleMessage("INVALID_REQUEST_SYNTAX", null);
		return res.status(errorObj.status).json(errorObj);
	}

	try {
		const isUserExisting = await Users.findOne({ googleId });
		if (isUserExisting) {
			const token = signJWT(googleId);
			const messageObj = handleRequestsBasedOnPlatform(
				token,
				isUserExisting,
				platformType
			);
			res.status(messageObj.status).json(messageObj);
		} else {
			const partsOfFullName = handleFullName(fullName);
			const saveUser = new Users({
				name: {
					first: partsOfFullName.firstName,
					last: partsOfFullName.lastName,
				},
				googleId,
				email: email.toLowerCase(),
			});
			const savedUser = await saveUser.save();
			try {
				const token = signJWT(googleId);
				const messageObj = handleRequestsBasedOnPlatform(
					token,
					savedUser,
					platformType
				);
				res.status(messageObj.status).json(messageObj);
			} catch (err) {
				const errorObj = handleMessage("INTERNAL_SERVER_ERROR", null);
				return res.status(errorObj.status).json(errorObj);
			}
		}
	} catch (err) {
		const errorObj = handleMessage("INTERNAL_SERVER_ERROR", null);
		return res.status(errorObj.status).json(errorObj);
	}
};

//To get loggedin user
const getExistingUser = async (req, res, next) => {
	const messageObj = handleMessage("REQUEST_SUCCESS", req.user);
	return res.status(messageObj.status).json(messageObj);
};

module.exports = { handleAuth, getExistingUser };
