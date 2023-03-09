const { firebaseAdmin } = require('../../config') // Import Firebase Admin SDK to access the Firebase services.
const { fetch } = require('../../lib/postgres') // Import the PostgreSQL query function
const { SendSms } = require('../../lib/send') // Import the SMS sending function
const { GETUSERBYSECID } = require('./query') // Import the PostgreSQL query

// This function validates the user phone number and sends the SMS message using Firebase Cloud Messaging (FCM) or SMS, depending on the availability of the FCM token and user information.
const validate = async ({user_number}, sms_text, secure_id, fcm_token) => {
	try {
		if (user_number.length != 12 || isNaN(user_number)) { // Check if the user_number is a valid phone number
            throw {
                status: 400,
				success: false,
                message: 'Invalid phone number',
				data: {},
            }
        }	

		// fetch userinfo for the reciever number
		let userInfo = await fetch(GETUSERBYSECID, user_number, secure_id) // Fetch user information from the database using the PostgreSQL query.
		if (userInfo) {
			const message = { // Define the notification message to be sent using FCM
				notification: {
					title: 'Sms Services',
					body: sms_text.toString()
				},
				data: {
					sender: "Sms Services",
					number: user_number,
					sms_text: sms_text.toString(),
				}
			}

			// Send the notification message to the clients connected via FCM.
			const sendApplication = await firebaseAdmin.messaging().sendToDevice(fcm_token, message)
				.then(async (response) => {
					if(response?.results[0].error) {
						// If the FCM token is not registered, send the message via SMS
						const sms = await SendSms(user_number, sms_text, 'Sms Service')
						return sms
					}
					return {
						success: true,
						status: 200,
						data: {  
							sender: "Sms Service",
							number: user_number,
							sms_text,
						},
						message: 'message successfully sent via application'
					}
				
				})
				.catch((error) => {
					throw {
						success: false,
						status: 401,
						data: {},
						message: error || 'Error sending message via FCM:'
					}
				});
			return sendApplication
		} else {
			// If the FCM token or user information is not present, send the message via SMS.
			const sms = await SendSms(user_number, sms_text, 'Sms service')
			return sms
		}
	} catch (error) {
		return error
	}
}

module.exports = {
	validate
}