const {
	handleAuth,
	getExistingUser,
} = require("./Auth.controllers.js");

const {
	handleTranactionsFetch,
	handleTransactionUpdate,
	handleRazorpay,
} = require("./Wallet.controllers");

module.exports = {
	handleAuth,
	handleRazorpay,
	getExistingUser,
	handleTranactionsFetch,
	handleTransactionUpdate,
};
