const router = require('express').Router()
const {  POST } = require('./controller.js')

router.route('/sendMessage')
	.post( POST )

module.exports = router