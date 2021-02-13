require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const fs = require('fs');
const https = require('https');

const privateKey = fs.readFileSync( 'pems/pri.pem' );
const certificate = fs.readFileSync( 'pems/cer.pem' );

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.enable("trust proxy"); //To log IP Address of the requests
app.use(
	morgan(
		":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"
	)
);

// s
app.get('/', function (req, res) {
  res.send('hello world')
});

//Server Routes
const handleAuth = require("./routes/Auth.routes");
app.use("/api/user", handleAuth);

const handleWalletActions = require("./routes/Wallet.routes");
app.use("/api/wallet", handleWalletActions);

const handleBuySellActions = require("./routes/Action.routes");
app.use("/api/action", handleBuySellActions);

//Mongodb Connection
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
const port = process.env.PORT;
//app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

https.createServer({ key: privateKey, cert: certificate
}, app).listen(port, () => console.log(`Server is running on port ${port}`));
