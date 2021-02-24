const crypto = require("crypto");
const handleMessage = require("../utils/MessageHandler");
const WalletTransactions = require("../models/WalletTransactions");
const Users = require("../models/Users");
const razorpay = require("razorpay");
const {
	RAZORPAY_WEBHOOK_SECRET,
	RAZORPAY_KEY_ID,
	RAZORPAY_KEY_SECRET,
} = process.env;

//To get all the wallet transactions of a user
const handleTranactionsFetch = async (req, res, next) => {
	const { googleId } = req.user;

	try {
		const foundTransactions = await WalletTransactions.find(
			{
				"user.googleId": googleId,
			},
			{ otherDetails: 0 }
		).sort({ time: -1 });

		if (foundTransactions.length > 0) {
			const messageObj = handleMessage("REQUEST_SUCCESS", foundTransactions);
			res.status(messageObj.status).json(messageObj);
		} else {
			const errorObj = handleMessage("NOT_FOUND", null);
			res.status(errorObj.status).json(errorObj);
		}
	} catch (err) {
		const errorObj = handleMessage("INTERNAL_SERVER_ERROR", null);
		return res.status(errorObj.status).json(errorObj);
	}
};

// To generate a razorpay order
const handleRazorpay = async (req, res, next) => {
	const instance = new razorpay({
		key_id: RAZORPAY_KEY_ID,
		key_secret: RAZORPAY_KEY_SECRET,
	});

	try {
		const response = await instance.orders.create({
			amount: 10000,
			currency: "INR",
			receipt: "thisisthetestreceipt",
			payment_capture: 1,
		});
		console.log(response, "response");
		res.json({
			id: response.id,
		});
	} catch (err) {
		console.log(err, "error");
	}
};

//To update wallet details of a user(Go through function below this one first)
const handleUserWalletUpdate = async (
	userId,
	amount,
	actionType,
	isTransactionSuccessful
) => {
	if (!isTransactionSuccessful)
		return { error: "Transaction Not Successful!", status: 500 };

	try {
		const updatedUser = await Users.updateOne(
			{
				_id: userId,
			},
			{
				$inc: {
					"stateOfProfile.moneyInWallet":
						actionType === "add" ? amount : -amount,
				},
			}
		);
		if (updatedUser) {
			const user = await Users.findById(userId);
			return { message: user, status: 200 };
		} else
			return {
				error: "Error with the request. Please try again!",
				status: 500,
			};
	} catch (err) {
		return {
			error: "Error with the request. Please try again!",
			status: 500,
		};
	}
};

//To update transaction of a user
const handleTransactionUpdate = async (req, res, next) => {
	const userId = req.body.payload.payment.entity.notes.id;
	const googleId = req.body.payload.payment.entity.notes.googleId;
	const amount = parseInt(req.body.payload.payment.entity.amount) / 100; //Divided by 100 because razorpay gives amount in smallest currency(paisa)
	const actionType = req.body.actionType || "add";
	const isTransactionSuccessful =
		req.body.payload.payment.entity.status.toLowerCase() === "captured";
	const otherDetails = req.body;

	const reqPath = req.originalUrl;
	const reqRoute = reqPath.split("/")[3]; //add or withdraw

	//Check if route matches the action type(this is just for double verification)
	if (reqRoute !== actionType)
		return res.status(400).json({
			error: "Error with the Request! Please try Again!",
			status: 400,
		});

	//check for negative balance
	if (
		actionType === "withdraw" &&
		req.user.stateOfProfile.moneyInWallet - amount < 0
	) {
		return res
			.status(400)
			.json({ error: "Cannot Withdraw more than balance!", status: 400 });
	}

	//This is to check if the razorpay request is legit and not forged
	const shasum = crypto.createHmac("sha256", RAZORPAY_WEBHOOK_SECRET);
	shasum.update(JSON.stringify(req.body));
	const digest = shasum.digest("hex");

	if (digest !== req.headers["x-razorpay-signature"]) {
		return res
			.status(502)
			.json({ error: "Fake Request Detected!", status: 502 });
	}

	const saveNewTransaction = new WalletTransactions({
		user: {
			id: userId,
			googleId,
		},
		amount,
		actionType,
		isTransactionSuccessful,
		otherDetails,
	});
	const savedTransaction = await saveNewTransaction.save();
	try {
		if (savedTransaction) {
			const updateUserData = await handleUserWalletUpdate(
				userId,
				amount,
				actionType,
				isTransactionSuccessful
			); //Calling function above this one
			return res
				.status(updateUserData.status)
				.json(
					updateUserData.message
						? { message: updateUserData.message, status: updateUserData.status }
						: { error: updateUserData.error, status: updateUserData.status }
				);
		} else {
			return res.status(500).json({
				error: "Error with the request. Please try again!",
				status: 500,
			});
		}
	} catch (err) {
		return res.status(500).json({
			error: "Error with the request. Please try again!",
			status: 500,
		});
	}
};

module.exports = {
	handleTranactionsFetch,
	handleTransactionUpdate,
	handleRazorpay,
};
