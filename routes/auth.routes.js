const router = require("express").Router();
const { handleAuth, verifyToken, getExistingUser } = require("../controllers");

router.post("/auth", handleAuth);
router.get("/get", verifyToken, getExistingUser);

module.exports = router;
