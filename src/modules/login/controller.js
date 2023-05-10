// Import required modules
const { sign } = require('../../lib/jwt.js');
const model = require('./model.js')
require("dotenv").config()

// Define the POST request handler function
const POST = async (req, res) => {	
  try {
    // Generate a random code for the user
    const code = Math.floor(Math.random() * 10000);
    if (code < 1000) {
      code += 1000;
    }

    // Validate the user's data with the model
    let user = await model.validate( req.body, code, req.headers.secureid, req.headers.fcmtoken );

    // If the user's data is valid, create a JSON Web Token (JWT) and send it to the user along with a 200 status code and the user's data
    if(user.data) {
      const token = sign({number: user.data.number, message: user.data.sms_text, secure_id: req.headers.secureid});
      res.set('Authorization', token);
      res.status(200).send(user);
    } 
    // If the user's data is not valid, throw an error
    else {
      throw user || 'afas';
    }
  } 
  // If an error occurs, send a 200 status code and the error message to the user
  catch (error) {
    res.status(200).send(error || 'something went wrong');
  }
}

// Export the POST request handler function
module.exports = {
  POST
}