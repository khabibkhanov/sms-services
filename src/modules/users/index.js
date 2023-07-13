const express = require('express')
const { GET, DELETE } = require('./controller.js')

const userRouter = express.Router()

userRouter.route('/api/users')
	.get(GET)

userRouter.route('/api/users')
	.delete(DELETE)

module.exports = userRouter