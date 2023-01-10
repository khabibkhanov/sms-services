const router = require('express').Router()
const {  POST } = require('./controller.js')

router.route('/api/login')
	.post( POST )

module.exports = router