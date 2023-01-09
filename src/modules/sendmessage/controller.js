const model = require('./model.js')

const POST = async (req, res) => {
  const message = await model.SendMessage(req.body);
  if(message) {
    res.status(200).send(message);
	} else {
    res.status(400).send( 'something went wrong')
	}
};

module.exports = {
	POST
}