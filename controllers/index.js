const {
	handleAuth,
	verifyToken,
	getExistingUser,
} = require("./Auth.controllers.js");

const {
	handleTranactionsFetch,
	handleTransactionUpdate,
	handleRazorpay,
	handleVerification,
} = require("./Wallet.controllers");

const {
	redisRoute,
	githubWebhook,
} = require('./Action.controllers')

module.exports = {
	handleAuth,
	verifyToken,
	handleRazorpay,
	getExistingUser,
	handleTranactionsFetch,
	handleTransactionUpdate,
	handleVerification,
	redisRoute,
	githubWebhook
};
