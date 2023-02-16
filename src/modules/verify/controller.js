const { sign } = require("../../lib/jwt");
const model = require('./model')
const jwt = require('jsonwebtoken')

const POST = async (req, res) => {
    try {
        // Get the user-entered code from the form cookies and return it as a string in the form data
        const token = jwt.verify( req.headers.authorization, 'ProgramSoftSecretKey');
        const fcm_token = req.headers.fcm_token
        const secure_id = req.headers.secure_id
        const data = req.body

        if (!fcm_token || !secure_id) {
            throw 'regstration token is not found'
        }

        // Check if the user-entered code matches the stored code
        if (data.message === token.message && data.number === token.number) {
            const verified = await model.SaveNumber(data.number, fcm_token, secure_id)
            res.set('access_token', sign(verified.user_number));
            res.status(200).send({
                success: true,
                message: 'Logged in successfully'
            })
        } else {
            throw 'invalid number or code'
        }
    } catch (error) {
        res.status(401).send({
            success: false,
            message: error
        })
    }
};

module.exports = {
	POST
}