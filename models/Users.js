const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			first: {
				//in small
				type: String,
				required: true,
			},
			last: {
				//in small
				type: String,
				required: true,
			},
		},
		googleId: {
			//uid
			type: String,
			required: true,
		},
		email: {
			//in small
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
