function handleMessage(codeName, payload) {
	switch (codeName) {
		case "REQUEST_SUCCESS":
			return {
				type: "message",
				status: 200,
				message: "Request Successful!",
				payload: payload,
			};
		case "RESOURCE_CREATED":
			return {
				type: "message",
				status: 201,
				message: "Request Successful and Resource Created!",
				payload: payload,
			};
		case "INVALID_REQUEST_SYNTAX":
			return {
				type: "error",
				status: 400,
				message: "Problem with the request. Please try again!",
				payload: payload,
			};
		case "NOT_LOGGED_IN":
			return {
				type: "error",
				status: 401,
				message: "You Must be Logged In to Continue",
				payload: payload,
			};
		case "NOT_FOUND":
			return {
				type: "error",
				status: 404,
				message: "Resource not found!",
				payload: payload,
			};
		case "INTERNAL_SERVER_ERROR":
			return {
				type: "error",
				status: 500,
				message: "Unable to process the request. Please try again!",
				payload: payload,
			};
	}
}

module.exports = handleMessage;
