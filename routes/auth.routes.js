const router = require("express").Router();
const {
	handleAuth,
	verifyToken,
	getExistingUser,
} = require("../controllers/Auth.controllers.js");

router.post("/login", handleAuth);
router.get("/get", verifyToken, getExistingUser);

module.exports = router;
