const usersModules = require('./users')
const loginModules = require('./login')
const SendMessageModules = require('./sendMessage')
const verifyModules = require('./verify')

module.exports = [
    usersModules,
    loginModules,
    SendMessageModules,
    verifyModules
]