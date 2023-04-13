// Import the `request` library for making HTTP requests
const request = require('request');

// Set the base URL and endpoint for the SMS service
const baseUrl = process.env.SMSURL;
const endpoint = process.env.SMSENDPOINT;

// Define an async function for sending an SMS message
const SendSms = async (number, message, sender = 'sms_service') => {
	// Set the query parameters for the request
	const params = {
		action: process.env.SMSACTION,
		msisdn: number,
		body: message,
		distr_id: process.env.SMSDISTRID
	};
	
	// Set the options for the request, including the URL and query parameters
	const options = {
		url: baseUrl + endpoint,
		qs: params
	};

	// Send the request to the SMS service endpoint
	await request(options, (error, response, body) => {
		if (error) {
			// If there was an error, throw an exception with a message indicating that the message could not be sent
			throw 'Message cannot be sent';
		} else {
			// If there was no error, the response body should contain a success message or error message, which should be handled by the calling function
			return body;
		}
	});
	// Return a success object with the sender, phone number, and SMS text data
	return {
		success: true,
		status: 200,
		data: {
		  sender,
		  number,
		  sms_text: message 
		},
		message: 'Successfully sent message via SMS'
	};
};

const sendNumberToSmsBase = async (number) => {
	try {
		const params = {
			action: 'add',
			msisdn: number
		};
		
		const options = {
			url: baseUrl + endpoint,
			qs: params
		};

		const log = await request(options, (error, response) => {
			if (error) {
				throw error
			} else  if (response?.body == 'ok') {
				return response.body
			}
		})

		return log
	} catch (error) {
		return error || 'error save to sms database'
	}

}

// Export the `SendSms` function for use in other modules
module.exports = {
    SendSms,
	sendNumberToSmsBase
};