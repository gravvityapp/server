require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
app.enable("trust proxy"); //To log IP Address of the requests
app.use(
	morgan(
		":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"
	)
);

//Server Routes
const handleAuth = require("./routes/auth.routes");
app.use("/api/user", handleAuth);

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
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));