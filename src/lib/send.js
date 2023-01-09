const request = require('request');

const baseUrl = 'http://81.95.228.2:8080';
const endpoint = '/sms_send.php';

const SendSms = async (number, message) => {

	// Set the query parameters for the request
	const params = {
		action: 'smsl',
		msisdn: number,
		body: message,
		id: 1063
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
		number,
		message
	}
}

module.exports = {
    SendSms
};