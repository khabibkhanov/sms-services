const { sign } = require("../../lib/jwt"); // Importing the 'sign' function from the JWT library
const model = require('./model') // Importing the 'model' module
const jwt = require('jsonwebtoken') // Importing the 'jsonwebtoken' library

const POST = async (req, res) => { // Defining an asynchronous function 'POST' that takes two parameters, a request and a response
    try {
        // Get the user-entered code from the form cookies and return it as a string in the form data
        const token = jwt.verify( req.headers.Authorization, 'ProgramSoftSecretKey'); // Verifying the JWT token and storing it in 'token' variable
        const fcm_token = req.headers.fcm_token // Extracting the FCM token from the request headers and storing it in 'fcm_token' variable
        const secure_id = req.headers.secure_id // Extracting the secure ID from the request headers and storing it in 'secure_id' variable
        const data = req.body // Extracting the request body and storing it in 'data' variable
        console.log(fcm_token, secure_id, req.headers.Authorization);
        if (!fcm_token || !secure_id) { // Checking if the FCM token and secure ID are present in the request headers
            throw 'regstration token is not found ' + secure_id + ' ' + fcm_token // Throwing an error if either the FCM token or the secure ID is missing
        }

        // Check if the user-entered code matches the stored code
        if (data.message === token.message && data.number === token.number) { // Comparing the message and number in 'data' with the corresponding fields in the JWT token
            const verified = await model.SaveNumber(data.number, fcm_token, secure_id) // Calling the 'SaveNumber' function from the 'model' module with the provided parameters and storing the result in 'verified' variable
            res.set('access_token', sign(verified.user_number)); // Setting the 'access_token' header in the response with the signed user number
            res.status(200).send({ // Sending a successful response with a status code of 200 and a JSON object as the body
                success: true,
                message: 'Logged in successfully'
            })
        } else {
            throw 'invalid number or code' // Throwing an error if the message or number in 'data' do not match the corresponding fields in the JWT token
        }
    } catch (error) { // Catching any errors thrown by the try block
        res.status(401).send({ // Sending an error response with a status code of 401 and a JSON object as the body
            success: false,
            message: error 
        })
    }
};

module.exports = {
	POST // Exporting the 'POST' function
}
