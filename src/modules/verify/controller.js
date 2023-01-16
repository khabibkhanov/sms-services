const { verify, sign } = require("../../lib/jwt");
const model = require('./model')
const jwt = require('jsonwebtoken')

const GET = async (req, res) => {
    console.log('get')
}

const POST = async (req, res) => {
    try {
    // Get the user-entered code from the form cookies and return it as a string in the form data
    const token = jwt.verify( req.headers.authorization, 'ProgramSoftSecretKey');
    const fcm_token = req.headers.fcm_token
    const data = req.body

    if (!fcm_token) {
        throw 'regstration token is not found'
    }

    // Check if the user-entered code matches the stored code
    if (data.code === token.code && data.number === token.number) {
        const verifiedNumber = await model.SaveNumber(data.number, fcm_token)
        res.status(200).send(verifiedNumber)
    } else {
        throw 'invalid number or code'
    }
    } catch (error) {
        res.status(401).send(error)
    }
};

module.exports = {
	POST,
    GET
}