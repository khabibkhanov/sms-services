const router = require('express').Router()
const {  GET, POST } = require('./controller.js')

router.route('/api/sendMessage')
	.get( GET )

router.route('/api/sendMessage')
	.post( POST )

module.exports = router