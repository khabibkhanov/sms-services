const model = require('./model.js')
const { sign } = require('../../lib/jwt')

const POST = async (req, res) => {	
	req.session.code = Math.floor(Math.random() * 1000000);
	let user = await model.validate( req.body, req.session.code )

	if(user) {
		res.cookie('token',	sign(user))
		res.status(200).send(user)
	} else {
       res.status(400).send('err')
	}
}

module.exports = {
	POST
}