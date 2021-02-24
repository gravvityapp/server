const router = require("express").Router();
const { handleAuth, getExistingUser } = require("../controllers");
const { verifyToken } = require("../middlewares");

router.post("/auth", handleAuth);
router.get("/get", verifyToken, getExistingUser);

module.exports = router;
