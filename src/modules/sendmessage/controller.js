const model = require('./model.js')
const { verify } = require('../../lib/jwt.js');

const GET = async (req, res) => {
  try {
    const { accesstoken } = req.headers;
    const { page = 1, limit = 10 } = req.query;

    // Verify the access token
    const vtoken = verify(accesstoken);

    // Retrieve the messages from the database using the access token and pagination parameters
    const result = await model.getMessages(vtoken.user_number, page, limit);

    if (result.success) {
      const { data, totalMessages } = result;
      const totalPages = Math.ceil(totalMessages / limit);

      const response = {
        status: 200,
        success: true,
        data: data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: totalPages,
          totalMessages: totalMessages,
        },
      };

      res.status(200).send(response);
    } else {
      res.status(400).send({
        status: 400,
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      message: 'Internal Server Error',
    });
  }
};

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
  try {
    console.log(req.params);

    // const vtoken = verify(req?.headers?.accesstoken)

    let isDelete = 0
    // if (!req?.params?.message_id && req?.params?.sender) {
    //   isDelete = await model.deleteMessageBySender(req?.params?.sender, vtoken)
    // } else {
    //   isDelete = await model.deleteOneMessage(req?.params?.message_id, vtoken)
    // }
    res.status(200).send(req.params)

    // If the message is deleted successfully, return a success response with the deleted message
    if (isDelete) {
      // res.status(200).send(isDelete)
    } else {
      return 'sms not deleted'
    }

  } catch (error) {
      res.status(400).send({
      case: error,
    })
  }
} 

// Export the request handlers for use in the routes
module.exports = {
  GET,
  POST,
  DELETE,
}