//These routes are for handling the buy sell actions
const router = require("express").Router();
const { redisRoute, githubWebhook, verifyToken } = require("../controllers");

//Get All actions
router.get("/all", verifyToken);
//Invest Call
router.post("/invest", verifyToken);
//Withdraw Call
router.post("/withdraw", verifyToken);
//route to get realtime profits
router.get("/profit", verifyToken);
// save to redis
router.post('/redis', redisRoute)
// github webhook
router.post('/githubWebhook', githubWebhook)

module.exports = router;
