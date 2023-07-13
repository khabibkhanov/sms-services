const { verify } = require('../../lib/jwt.js')
const validate = require('./model.js')

const GET = async (req, res) => {
    let user = await validate.getUsers()
    res.send(user)
}

const DELETE = async (req, res) => {
    try {
        let vtoken = verify(req?.headers?.accesstoken)
        let user = await validate.deleteUser(vtoken?.number || vtoken?.user_number)
    
        res.send(user)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    GET,
    DELETE
}