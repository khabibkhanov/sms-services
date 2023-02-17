// Import necessary dependencies and controllers
const router = require('express').Router()
const { GET, POST, DELETE } = require('./controller.js')

// Set up routes for getting messages, sending messages, and deleting messages
router.route('/api/messages')
	.get(GET)

router.route('/api/sendMessage')
	.post(POST)

router.route('/api/messages/:message_id')
	.delete(DELETE)

// Export the router for use in the main app
module.exports = router