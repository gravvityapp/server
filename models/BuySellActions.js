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
				//uid
				type: String,
				required: true,
			},
		},
		amount: {
			//amount of money user is investing/withdrawing(include profit in withdrawing)
			type: Number,
			required: true,
		},
		actionType: {
			// add or withdraw
			type: String,
			required: true,
		},
		stockPrice: {
			// Price of stock at that moment
			type: Number,
			required: true,
		},
		stockCode: {
			//ril or sbin (in small)
			type: String,
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

// [

// {
// 	user1
// 	sell
// 	time0
// }

// 	{
// 	user1
// 	buy
// 	time1
// },

// {
// 	user1
// 	buy
// 	time2
// }
// ]

// redis == all logs

// {
// 	time1
// 	stockPrice
// }
