const model = require('./model.js')
  
const GET = async (req, res) => {
  // Retrieve the messages from the database
  let message = await model.getMessages(req?.cookies?.registration_token);

  if(message) {
    res.status(200).send(message || 'message');
	} else {
    res.status(400).send( 'something went wrong')
	}
} 

const POST = async (req, res) => {
  const message = await model.SendMessage(req.body, req?.cookies?.registration_token);

  if (message) {
    res.status(200).send(message || 'message arrived successfully')
  } else {
    res.status(404).send('something went wrong')
  }
};

module.exports = {
  GET,
  POST
}