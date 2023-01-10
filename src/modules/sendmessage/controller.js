const { verify } = require('../../lib/jwt.js');
const model = require('./model.js')

const POST = async (req, res) => {
  const message = await model.SendMessage(req.body, req?.cookies?.access_token);

  if(message) {
    res.status(200).send(message );
	} else {
    res.status(400).send( 'something went wrong')
	}
};

module.exports = {
	POST
}