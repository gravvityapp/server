const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletTransactionsSchema = new Schema(
	{
		user: {
			id: {
				type: String,
				required: true,
			},
			googleId: {
				type: String,
				required: true,
			},
		},
		amount: {
			type: Number,
			required: true,
		},
		actionType: {
			// add or withdraw
			type: String,
			required: true,
		},
		isPaymentSuccessful: {
			// Can be some error in the process so this is required
			type: Boolean,
			required: true,
		},
		otherDetails: {
			type: Object,
			required: true,
		},
		time: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("WalletTransactions", walletTransactionsSchema);
