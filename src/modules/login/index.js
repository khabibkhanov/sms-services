// Import the necessary modules
const router = require('express').Router()
const {  POST } = require('./controller.js')

// Define the route and method for handling POST requests to '/api/login'
router.route('/api/login')
	.post( POST )

// Export the router to be used by other modules
module.exports = router
