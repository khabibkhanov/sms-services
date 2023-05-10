// Import the axios library for making HTTP requests
const axios = require('axios');
require('dotenv').config()

// Set the base URL and endpoint for the SMS service
const baseUrl = process.env.SMSURL;
const endpoint = process.env.SMSENDPOINT;
const action = process.env.SMSACTION;
const distr_id = process.env.SMSDISTRID;

// Define an async function for sending an SMS message
const SendSms = async (number, message, sender = 'sms_service') => {

	async function sending(action, number, message, distr_id) {
		const url = `${baseUrl}${endpoint}?action=${action}&msisdn=${number}&body=${message}&distr_id=${distr_id}`;
		try {
			const response = await axios.get(url);
			return response
		} catch (error) {
			return `Message cannot be sent: ${error.message}`
		}
	}

	const isSend = await sending(action, number, message, distr_id);
	
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
}


async function sendNumberToSmsBase(number) {
	const url = `${baseUrl}${endpoint}?action=del&msisdn=${number}`;
	const response = await axios.get(url);
	if (response.data) {
	  return response.data;
	} else {
	  throw new Error(response.error);
	}
  }
  

// Export the `SendSms` function for use in other modules
module.exports = {
    SendSms,
	sendNumberToSmsBase
};