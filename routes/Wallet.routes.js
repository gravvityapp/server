const router = require("express").Router();
const {
	verifyToken,
	handleTranactionsFetch,
	handleTransactionUpdate,
} = require("../controllers");

router.get("/all", verifyToken, handleTranactionsFetch);

router.post("/add", verifyToken, handleTransactionUpdate); //To add the transaction details in WalletTransactions Schema

module.exports = router;
