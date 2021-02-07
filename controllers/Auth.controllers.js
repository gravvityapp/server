const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
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

//To handle User signup and login
const handleAuth = async (req, res, next) => {
	const { fullName, googleId, email, platformType } = req.body; //platformType can either be "app" or "web"

	if (!fullName || !googleId || !email || !platformType) {
		return res.status(400).json({
			error: "Problem with the request. Please try again!",
			status: 400,
		});
	}

	try {
		const isUserExisting = await Users.findOne({ googleId });
		if (isUserExisting) {
			const token = signJWT(googleId);
			if (platformType === "app")
				res
					.status(200)
					.json({ message: token, user: isUserExisting, status: 200 });
			else if (platformType === "web") res;
			res.status(200).json({ message: token, redirect: true, status: 200 });
		} else {
			const partsOfFullName = handleFullName(fullName);
			const saveUser = new Users({
				name: {
					first: partsOfFullName.firstName,
					last: partsOfFullName.lastName,
				},
				googleId,
				email,
			});
			const savedUser = await saveUser.save();
			try {
				const token = signJWT(googleId);
				if (platformType === "app")
					return res
						.status(201)
						.json({ message: token, user: savedUser, status: 201 });
				else if (platformType === "web") res;
				res.status(201).json({ message: token, redirect: true, status: 201 });
			} catch (err) {
				return res.status(500).json({
					error: "Error with the request. Please try again!",
					status: 500,
				});
			}
		}
	} catch (err) {
		return res.status(500).json({
			error: "Error with the request. Please try again!",
			status: 500,
		});
	}
};

//To verify jwt token
const verifyToken = async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization)
		return res
			.status(401)
			.json({ error: "You Must be Logged In to Continue", status: 401 });
	const token = authorization.replace("Bearer ", "");
	jwt.verify(token, JWT_SECRET, async (err, payload) => {
		if (err)
			return res
				.status(401)
				.json({ error: "You Must be Logged In to Continue", status: 401 });

		const { googleId } = payload;
		const fetchedUser = await Users.findOne({ googleId });
		try {
			req.user = fetchedUser;
			next();
		} catch (err) {
			res.status(500).json({
				error: "Unable to login. Please restart the app!",
				status: 500,
			});
		}
	});
};

//To get loggedin user
const getExistingUser = async (req, res, next) => {
	return res.status(200).json({ message: req.user, status: 200 });
};

module.exports = { handleAuth, verifyToken, getExistingUser };
