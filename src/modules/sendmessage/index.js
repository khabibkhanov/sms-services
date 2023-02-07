const router = require('express').Router()
const {  GET, POST, DELETE } = require('./controller.js')

router.route('/api/messages')
	.get( GET )

router.route('/api/sendMessage')
	.post( POST )

router.route('/api/messages/:message_id')
	.delete( DELETE )

module.exports = router