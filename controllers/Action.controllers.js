const BuySellActions = require("../models/BuySellActions");
const Users = require("../models/Users");

//To get all the wallet transactions of a user
const handleActionsFetch = async (req, res, next) => {
	const { googleId } = req.user;

	try {
		const foundActions = await BuySellActions.find({
			user: { googleId },
		}).sort({ time: -1 });

		if (foundActions.length > 0)
			return res.status(200).json({ message: foundActions });
		else res.status(404).json({ error: "No Actions Found!" });
	} catch (err) {
		return res
			.status(500)
			.json({ error: "Error with the request. Please try again!" });
	}
};

//To update investing state details of a user
const handleUserInvestingStateUpdate = async (userId, amount) => {
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


// Redis route
const redisRoute = async (req, res, _) => {
	if (req.body.apikey === process.env.REDIS_APIKEY) {
		const redis = require('redis')
		const redis_client = redis.createClient({
			port: 6379,
			host: "127.0.0.1"
		})
		redis_client.on('connect', () => {
			console.log('Redis Client connected!');
		})
		redis_client.set(req.body.key, req.body.value)
		return res
			.status(200)
			.json({ msg: 'value set successfully'})
	}
	else {
		return res
			.status(403)
			.json({ msg: 'sorry sir, restricted area'})
	}
}


// GITHUB pull request
const githubWebhook = async (req, res, _) => {
	if (
		req.body.ref.indexOf('master') > -1 && 
		(
			req.body.sender.login === 'kyteinsky' ||
			req.body.sender.login === 'AdityaKG-169'
		)
	){
		const simpleGit = require('simple-git');

		const options = {
			baseDir: process.cwd()+'/../',
			binary: 'git',
			maxConcurrentProcesses: 6,
		};
		
		const git = simpleGit(options);

		git.pull()
		console.log('pulled from github repo');
	}
}

module.exports = {
	handleActionsFetch,
	handleUserInvestingStateUpdate,
	redisRoute,
	githubWebhook
};
