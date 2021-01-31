const WalletTransactions = require("../models/WalletTransactions");
const Users = require("../models/Users");

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

		if (foundTransactions.length > 0)
			res.status(200).json({ message: foundTransactions });
		else res.status(404).json({ error: "No Transactions Found!" });
	} catch (err) {
		return res
			.status(500)
			.json({ error: "Error with the request. Please try again!" });
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
	const userId = req.user._id;
	const googleId = req.user.googleId;
	const amount = parseInt(req.body.amount);
	const actionType = req.body.actionType;
	const isTransactionSuccessful = req.body.isTransactionSuccessful;
	const otherDetails = req.body.otherDetails;

	//check for negative balance
	if (
		actionType === "withdraw" &&
		req.user.stateOfProfile.moneyInWallet - amount < 0
	) {
		return res
			.status(400)
			.json({ error: "Cannot Withdraw more than balance!" });
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
						? { message: updateUserData.message }
						: { error: updateUserData.error }
				);
		} else {
			return res
				.status(500)
				.json({ error: "Error with the request. Please try again!" });
		}
	} catch (err) {
		return res
			.status(500)
			.json({ error: "Error with the request. Please try again!" });
	}
};

module.exports = {
	handleTranactionsFetch,
	handleTransactionUpdate,
};
