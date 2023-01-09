const { verify } = require("../../lib/jwt");
const model = require('./model')

const GET = async (req, res) => {
    console.log('get')
}

const POST = async (req, res) => {

    // Get the user-entered code from the form
    const token = verify( req.cookies.token);
    const data = req.body

    // Check if the user-entered code matches the stored code
    if (data.code === token.code && data.number === token.number) {
        const smst = await model.SaveNumber(data.number)
        res.send(smst)
    } else {
        res.status(401).send('invalid code')
    }
};

module.exports = {
	POST,
    GET
}