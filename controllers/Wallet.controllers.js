const WalletTransactions = require("../models/WalletTransactions");
const Users = require("../models/Users");

//To get all the wallet transactions of a user
const handleTranactionsFetch = async (req, res, next) => {
	const { googleId } = req.user;

	try {
		const foundTransactions = await WalletTransactions.find(
			{
				user: { googleId },
			},
			{ otherDetails: 0 }
		).sort({ time: -1 });

		if (foundTransactions.length > 0)
			return res.status(200).json({ message: foundTransactions });
		else res.status(404).json({ error: "No Transactions Found!" });
	} catch (err) {
		return res
			.status(500)
			.json({ error: "Error with the request. Please try again!" });
	}
};

//To update wallet details of a user
const handleUserWalletUpdate = async (userId, amount) => {
	try {
		const updatedUser = await Users.updateOne(
			{
				id: userId,
			},
			{
				$inc: {
					stateOfProfile: {
						moneyInWallet: amount,
					},
				},
			}
		);
		if (updatedUser) return { message: updatedUser, status: 200 };
		else
			return {
				error: "Error with the request. Please try again!",
				status: 500,
			};
	} catch (err) {
		return { error: "Error with the request. Please try again!", status: 500 };
	}
};

//To update transaction of a user
const handleTransactionUpdate = async (req, res, next) => {
	const userId = req.user._id;
	const googleId = req.user.googleId;
	const amount = parseInt(req.body.amount);
	const actionType = req.body.actionType;
	const isPaymentSuccessful = req.body.isPaymentSuccessful;
	const otherDetails = req.body.otherDetails;

	const saveNewTransaction = new WalletTransactions({
		user: {
			id: userId,
			googleId,
		},
		amount,
		actionType,
		isPaymentSuccessful,
		otherDetails,
	});
	const savedTransaction = await saveNewTransaction.save();
	try {
		if (savedTransaction) {
			const updateUserData = await handleUserWalletUpdate(userId, amount);
			console.log(updateUserData);
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
