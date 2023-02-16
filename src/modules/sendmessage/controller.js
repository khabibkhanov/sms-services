const model = require('./model.js')

const GET = async (req, res) => {
  // Retrieve the messages from the database
  let message = await model.getMessages(req?.headers?.access_token);

  if(message) {
    res.status(200).send(message)
	} else {
    res.status(400).send({
        status: 400,
        success: false,
        data: 'something went wrong'
    })
	}
}

const POST = async (req, res) => {
  const message = await model.sendMessage(req.body, req.app.locals.websockets);
  if (message) {
    res.status(200).send(message || 'message arrived successfully')
  } else {
    res.status(404).send('something went wrong')
  }
};

const DELETE = async (req, res) => {
  let isDelete = await model.deleteMessage(req?.params?.message_id, req?.headers?.access_token)
  if (isDelete) {
    res.status(200).send(isDelete)
  } else {
    res.status(400).send({
      case: 'Something went wrong',
    })
  }
}

module.exports = {
  GET,
  POST,
  DELETE,
}