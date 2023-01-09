const { SendSms } = require('../../lib/send')

const validate = async ({user_number}, code) => {
	try {
		if (user_number.length != 12) {
            throw {
                status: 400,
                message: 'Invalid phone number'
            }
        }

		if (isNaN(user_number)) {
			throw {
                status: 400,
                message: 'User number must be a number'
            }
		}

		const sending = await SendSms(user_number, code)

        if (!sending) {
            throw {
                status: 400,
				message: 'Invalid code'
            }
		}

		return sending

	} catch (error) {
		return error
	}
}

module.exports = {
	validate
}