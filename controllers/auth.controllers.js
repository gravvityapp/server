const Users = require("../models/Users");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");

//To Sign JWT Token
const signJWT = (googleId) => {
	const token = jwt.sign({ googleId }, JWT_SECRET);
	return token;
};

//To handle User signup and login
const handleAuth = async (req, res, next) => {
	const { fullName, googleId, email } = req.body;

	if (!fullName || !googleId || !email) {
		return res
			.status(400)
			.json({ error: "Problem with the request. Please try again!" });
	}

	try {
		const isUserExisting = await Users.findOne({ googleId });
		if (isUserExisting) {
			const token = signJWT(googleId);
			res.status(200).json({ message: token, user: isUserExisting });
		} else {
			const partsOfFullName = fullName.split(" ");
			const firstName = partsOfFullName[0].toLowerCase();
			const lastName = partsOfFullName[
				partsOfFullName.length - 1
			].toLowerCase();
			const saveUser = new Users({
				name: {
					first: firstName,
					last: lastName,
				},
				googleId,
				email,
			});
			const savedUser = await saveUser.save();
			try {
				const token = signJWT(googleId);
				return res.status(201).json({ message: token, user: savedUser });
			} catch (err) {
				return res
					.status(500)
					.json({ error: "Error with the request. Please try again!" });
			}
		}
	} catch (err) {
		return res
			.status(500)
			.json({ error: "Error with the request. Please try again!" });
	}
};

//To verify jwt token
const verifyToken = async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization)
		return res.status(401).json({ error: "You Must be Logged In to Continue" });
	const token = authorization.replace("Bearer ", "");
	jwt.verify(token, JWT_SECRET, async (err, payload) => {
		if (err)
			return res
				.status(401)
				.json({ error: "You Must be Logged In to Continue" });

		const { googleId } = payload;
		const fetchedUser = await Users.findOne({ googleId });
		try {
			req.user = fetchedUser;
			next();
		} catch (err) {
			res
				.status(500)
				.json({ error: "Unable to login. Please restart the app!" });
		}
	});
};

//To get loggedin user
const getExistingUser = async (req, res, next) => {
	return res.status(200).json({ message: req.user });
};

module.exports = { handleAuth, verifyToken, getExistingUser };
