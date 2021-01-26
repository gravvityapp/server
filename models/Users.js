const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			first: {
				type: String,
				required: true,
			},
			last: {
				type: String,
				required: true,
			},
		},
		googleId: {
			type: String,
			required: true,
		},
		stateOfProfile: {
			moneyInWallet: {
				type: Number,
				default: 0,
			},
			totalProfit: {
				type: Number,
				default: 0,
			},
			isInvesting: {
				type: Boolean,
				default: false,
			},
			amountInvested: {
				// If isInvesting is true
				type: Number,
				default: 0,
			},
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

module.exports = mongoose.model("User", userSchema);
