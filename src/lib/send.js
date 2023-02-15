const request = require('request');

const baseUrl = 'http://81.95.228.2:8080';
const endpoint = '/sms_send_code.php';

const SendSms = async (number, message, sender = 'sms_service') => {

	// Set the query parameters for the request
	const params = {
		action: 'sms',
		msisdn: number,
		body: message,
		distr_id: 1057
	};
	
	// Set the options for the request
	const options = {
		url: baseUrl + endpoint,
		qs: params
	};

	// Send the request to the endpoint
	await request(options, (error, response, body) => {
		if (error) {
			// Handle any error that occurred
			throw 'Message cannot be sent'
		} else {
			// Handle the response from the endpoint
			return body
		}
	});

	return {
		success: true,
		status: 200,
		data: {
		  sender,
		  number,
		  sms_text: message 
		},
		message: 'Successfully sent message via SMS'
	}
}

module.exports = {
    SendSms
};