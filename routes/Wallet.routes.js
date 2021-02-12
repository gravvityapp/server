const router = require("express").Router();
const {
	verifyToken,
	handleTranactionsFetch,
	handleRazorpay,
	handleTransactionUpdate,
	handleVerification,
} = require("../controllers");

router.get("/all", verifyToken, handleTranactionsFetch); //get all the transactions by user

router.post("/add", verifyToken, handleTransactionUpdate); //To add the transaction details in WalletTransactions Schema and update user

router.post("/withdraw", verifyToken, handleTransactionUpdate);

router.post("/razorpay", handleRazorpay);

router.post("/verification", handleVerification);

module.exports = router;
