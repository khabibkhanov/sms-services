const { fetch } = require('../../lib/postgres') // Importing 'fetch' function from PostgreSQL library
const { VALIDATE } = require('./query') // Importing 'VALIDATE' query from a separate file

const SaveNumber = async (number, fcm_token, secure_id) => { // Defining an asynchronous function 'SaveNumber' that takes three parameters
  try {
    if (isNaN(number)) { // Checking if the 'number' parameter is a valid number
			throw 'User number must be a number' // Throwing an error if 'number' is not a valid number
	}

  let userInfo = await fetch(VALIDATE, number, fcm_token, secure_id) // Executing the 'VALIDATE' query using the 'fetch' function and storing the result in 'userInfo' variable
  if (!userInfo) { // Checking if 'userInfo' is falsy
    throw "cannot login user" // Throwing an error if 'userInfo' is falsy
  } else {
    return userInfo // Returning 'userInfo' if it is truthy
  }

  } catch (error) { // Catching any errors thrown by the try block
    return error // Returning the error object
  }
}

module.exports = {
    SaveNumber // Exporting the 'SaveNumber' function
}