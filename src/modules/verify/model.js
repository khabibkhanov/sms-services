const { fetch } = require('../../lib/postgres')
const { VALIDATE } = require('./query')

const SaveNumber = async (number) => {
  try {
    if (isNaN(number)) {
			throw 'User number must be a number'
	}
  
    let userInfo = await fetch(VALIDATE, number)
    
    if (!userInfo) {
      throw "cannot login "
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