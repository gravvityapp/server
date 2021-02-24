//TODO ---- Add SSL Config for production
//TODO ---- Take all the JSON objects for messages and errors and add in utils folder

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// TODO ---- Remove morgan and configure Winston
app.enable("trust proxy"); //To log IP Address of the requests
app.use(
	morgan(
		":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"
	)
);

//Server Routes
const handleAuth = require("./routes/Auth.routes");
app.use("/api/user", handleAuth);

const handleWalletActions = require("./routes/Wallet.routes");
app.use("/api/wallet", handleWalletActions);

const handleBuySellActions = require("./routes/Action.routes");
app.use("/api/action", handleBuySellActions);

//Mongodb Connection
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to the database!");
	})
	.catch((err) => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});

//Port Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
