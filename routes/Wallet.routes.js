const router = require("express").Router();
const {
	handleTranactionsFetch,
	handleRazorpay,
	handleTransactionUpdate,
} = require("../controllers");
const { verifyToken } = require("../middlewares");

router.get("/all", verifyToken, handleTranactionsFetch); //get all the transactions by user

router.post("/add", handleTransactionUpdate); //To add the transaction details in WalletTransactions Schema and update user......also, this is the webhook that is called by razorpay after payment

router.post("/withdraw", verifyToken, handleTransactionUpdate);

router.post("/razorpay", verifyToken, handleRazorpay); //To create an order for razorpay

module.exports = router;
