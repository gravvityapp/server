const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buySellActionsSchema = new Schema(
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
			//amount of money user is investing/withdrawing
			type: Number,
			required: true,
		},
		actionType: {
			// buy or sell
			type: String,
			required: true,
		},
		stockPrice: {
			// Price of stock at that moment
			type: Number,
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

module.exports = mongoose.model("BuySellActions", buySellActionsSchema);
