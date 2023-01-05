const model = require('./model.js')

const POST = async (req, res) => {
	let user = await model.validate( req.body )
	if(user) {
		res.send(user)
	} else {
       res.status(400).send(err)
	}
}

module.exports = {
	POST
}