const { firebaseAdmin } = require('../../config')
const { fetch } = require('../../lib/postgres')
const { SendSms } = require('../../lib/send')
const { GETUSERBYSECID } = require('./query')

const validate = async ({user_number}, sms_text, secure_id, fcm_token) => {
	try {
		if (user_number.length != 12 || isNaN(user_number)) {
            throw {
                status: 400,
				success: false,
                message: 'Invalid phone number',
				data: {},
            }
        }	

		// fetch userinfo for the reciever number
		let userInfo = await fetch(GETUSERBYSECID, user_number, secure_id)
		if (userInfo) {
			const message = {
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
			console.log(fcm_token, message);
			// // notify the clients connected via FCM
			const sendApplication = await firebaseAdmin.messaging().sendToDevice(fcm_token, message)
				.then(async (response) => {
					if(response?.results[0].error) {
						fcmIsWorking = true
						// If Response token is not registered send sms to device
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
					console.log(error);
					throw {
						success: false,
						status: 401,
						data: {},
						message: error || 'Error sending message via FCM:'
					}
				});
				console.log(sendApplication);
			return sendApplication
		} else {
			// if token or userInfo not present send via SMS
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