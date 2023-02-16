const model = require('./model.js')
const jwt = require('jsonwebtoken');

const POST = async (req, res) => {	
try {

	// console.log(req.session.code);
	const code = Math.floor(Math.random() * 10000);
	if (code < 1000) {
	  code += 1000;
	}
	console.log('sada');

	let user = await model.validate( req.body, code, req.headers.secure_id, req.headers.fcm_token)
	if(user.data) {
		const token = jwt.sign({number: user.data.number, message: user.data.sms_text, secure_id: req.headers.secure_id}, 'ProgramSoftSecretKey');
		res.set('Authorization', token);
		res.status(200).send(user)
	} else {
		throw user || 'afas'
	}
} catch (error) {
	res.status(200).send(error || 'something went wrong')
}
}

module.exports = {
	POST
}