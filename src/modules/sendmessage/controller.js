const model = require('./model.js')

// GET request handler for retrieving messages
const GET = async (req, res) => {
  // Retrieve the messages from the database using the access token provided in the request headers
  let message = await model.getMessages(req?.headers?.access_token);

  // If messages are retrieved successfully, return a success response with the messages
  if(message) {
    res.status(200).send(message)
  }
  // If there is an error while retrieving the messages, return a failure response
  else {
    res.status(400).send({
        status: 400,
        success: false,
        data: 'something went wrong'
    })
  }
}

// POST request handler for sending a message
const POST = async (req, res) => {
  // Send the message using the message data provided in the request body and the websockets provided in the app locals
  const message = await model.sendMessage(req.body, req.app.locals.websockets);
  
  // If the message is sent successfully, return a success response with the message
  if (message) {
    res.status(200).send(message || 'message arrived successfully')
  } 
  // If there is an error while sending the message, return a failure response
  else {
    res.status(404).send('something went wrong')
  }
};

// DELETE request handler for deleting a message
const DELETE = async (req, res) => {
  // Delete the message with the given message_id using the access token provided in the request headers
  let isDelete = await model.deleteMessage(req?.params?.message_id, req?.headers?.access_token)
  
  // If the message is deleted successfully, return a success response with the deleted message
  if (isDelete) {
    res.status(200).send(isDelete)
  } 
  // If there is an error while deleting the message, return a failure response
  else {
    res.status(400).send({
      case: 'Something went wrong',
    })
  }
}

// Export the request handlers for use in the routes
module.exports = {
  GET,
  POST,
  DELETE,
}