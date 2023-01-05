const router = require('express').Router()
const {  POST } = require('./controller.js')

router.route('/login')
	.post( POST )

module.exports = router