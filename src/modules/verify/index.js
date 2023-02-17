const router = require('express').Router() // Importing the 'express' library and creating a new router object
const { GET, POST } = require('./controller.js') // Importing the 'GET' and 'POST' functions from the 'controller.js' module

router.route('/api/verify')	// Defining a new route for handling requests to the '/api/verify' endpoint
	.post( POST ) // Adding a handler for HTTP POST requests to the '/api/verify' endpoint using the 'POST' function from the 'controller.js' module

module.exports = router // Exporting the router object for use in other modules
