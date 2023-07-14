const { verify } = require('../../lib/jwt.js')
const validate = require('./model.js')

const GET = async (req, res) => {
    let user = await validate.getUsers()
    res.send(user)
}

const DELETE = async (req, res) => {
    try {
        let vtoken = verify(req?.headers?.accesstoken)
        let response = await validate.deleteUser(vtoken?.number || vtoken?.user_number)
        
        res.send({
            status: 200,
            success: true,
            message: 'user deleted'
        })
    } catch (error) {
        res.send({
            status: 400,
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    GET,
    DELETE
}