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
			//uid from firebase
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
				//This is the total profit of that account
				type: Number,
				default: 0,
			},
			realtimeProfit: {
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

//When click invest:
// 1. Subtract the money in Wallet
// 2. isInvesting is set to true
// 3. amountInvested is set to the amount
// 4. action is logged in the action schema
// 5. redis is updated
// 6. fetch calls to calc. realtime profit starts

//When click withdraw:
// 1. isInvesting is set to false
// 2. amountInvested is set to 0
// 3. Profit calculation starts
// 4. totalProfit is updated
// 5. moneyInWallet is updated(add total amount invested and the total profit earned to the wallet)
// 6. action is logged in the action Schema
// 7. redis is updated
