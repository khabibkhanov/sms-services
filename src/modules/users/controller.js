const validate = require('./model.js')

const GET = async (req, res) => {
    let user = await validate.getUsers()
    res.send(user)
}

module.exports = {
    GET
}