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

module.exports = {
	handleAuth,
	verifyToken,
	handleRazorpay,
	getExistingUser,
	handleTranactionsFetch,
	handleTransactionUpdate,
	handleVerification,
};
