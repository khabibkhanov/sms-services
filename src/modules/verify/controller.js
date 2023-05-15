const { sign, verify } = require("../../lib/jwt"); // Importing the 'sign' function from the JWT library
const model = require('./model') // Importing the 'model' module

const POST = async (req, res) => { // Defining an asynchronous function 'POST' that takes two parameters, a request and a response
    try {
        const { authorization, fcmtoken, secureid } = req.headers;
        const token = verify( authorization); // Verifying the JWT token and storing it in 'token' variable
        const data = req.body;

        if (!fcmtoken || !secureid) { // Checking if the FCM token and secure ID are present in the request headers
            throw req.headers  // Throwing an error if either the FCM token or the secure ID is missing
        }

        // Check if the user-entered code matches the stored code
        if (data.message === token.message && data.number === token.number) { // Comparing the message and number in 'data' with the corresponding fields in the JWT token
            const verified = await model.SaveNumber(data.number, fcmtoken, secureid) // Calling the 'SaveNumber' function from the 'model' module with the provided parameters and storing the result in 'verified' variable
            if (verified) {
                const vtoken = sign({user_number: data.number})
                res.set('accesstoken', vtoken ); // Setting the 'access_token' header in the response with the signed user number
                res.status(200).send({ // Sending a successful response with a status code of 200 and a JSON object as the body
                    success: true,
                    message: 'Logged in successfully'
                })
            } else {
                throw   verified + 'Error'

            }
           
        } else {
            throw 'invalid number or code' // Throwing an error if the message or number in 'data' do not match the corresponding fields in the JWT token
        }
    } catch (error) {
        // Catching any errors thrown by the try block
        res.status(401).send({ // Sending an error response with a status code of 401 and a JSON object as the body
            success: false,
            message: error
        })
    }
};

module.exports = {
	POST // Exporting the 'POST' function
}