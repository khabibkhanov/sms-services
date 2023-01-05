const { fetch } = require('../../lib/postgres.js')
const { VALIDATE } = require('./query.js')

const validate = async ({ user_number, user_password }) => {

	try {
		if (isNaN(user_number)) {
			throw 'User number must be a number'
		}
		let user = await fetch(VALIDATE, user_number, user_password)
		if (user) {
			return user
		} else {
			throw 'wrong password or invalid number'			
		}
	} catch (error) {
		return error
	}
    // if (user_password.length < 8) {
    //     throw new Error('User password must be at least 8 characters long')
    // }
	
}

module.exports = {
	validate
}