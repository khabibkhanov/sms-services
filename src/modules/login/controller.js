const model = require('./model.js')
const { sign } = require('../../lib/jwt')
const jwt = require('jsonwebtoken')

const POST = async (req, res) => {	
	req.session.code = Math.floor(Math.random() * 10000);
	let user = await model.validate( req.body, req.session.code )

	if(user) {
		const token = jwt.sign(user, 'ProgramSoftSecretKey');
		res.set('Authorization', token);

		res.status(200).send('ok')
	} else {
       res.status(400).send('err')
	}
}

module.exports = {
	POST
}