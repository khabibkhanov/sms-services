const router = require('express').Router()
const { GET, POST } = require('./controller.js')

router.route('/api/verify')	
	.post( POST )

module.exports = router