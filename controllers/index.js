const {
	handleAuth,
	verifyToken,
	getExistingUser,
} = require("./Auth.controllers.js");

const {
	handleTranactionsFetch,
	handleTransactionUpdate,
} = require("./Wallet.controllers");

module.exports = {
	handleAuth,
	verifyToken,
	getExistingUser,
	handleTranactionsFetch,
	handleTransactionUpdate,
};
