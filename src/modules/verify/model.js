const { fetch } = require('../../lib/postgres')
const { VALIDATE } = require('./query')

const SaveNumber = async (number, fcm_token, secure_id) => {
  try {
    if (isNaN(number)) {
			throw 'User number must be a number'
	}

  let userInfo = await fetch(VALIDATE, number, fcm_token, secure_id)
  if (!userInfo) {
    throw "cannot login user"
  } else {
    return userInfo
  }

  } catch (error) {
    return error
  }
}

module.exports = {
    SaveNumber
}