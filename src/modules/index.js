const usersModules = require('./users')
const loginModules = require('./login')
const SendMessageModules = require('./sendmessage')
const verifyModules = require('./verify')

module.exports = [
    usersModules,
    loginModules,
    SendMessageModules,
    verifyModules
]