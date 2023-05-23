// Import necessary dependencies and controllers
const router = require('express').Router();
const { GET, POST, DELETE } = require('./controller.js');

// Create an array to store incoming requests
const requestQueue = [];

// Function to process requests from the queue
const processNextRequest = async () => {
  if (requestQueue.length > 0) {
    const request = requestQueue.shift(); // Get the next request from the queue

    // Process the request using the appropriate controller function based on the request method
    switch (request.method) {
      case 'GET':
        await GET(request.req, request.res);
        break;
      case 'POST':
        await POST(request.req, request.res);
        break;
      case 'DELETE':
        await DELETE(request.req, request.res);
        break;
      default:
        // Handle unsupported request method
        request.res.status(400).json({ error: 'Unsupported request method'});
        break;
    }
    // Process the next request in the queue
    processNextRequest();
  }
};

// Middleware to push incoming requests to the queue
const pushToQueueMiddleware = (req, res, next) => {
  requestQueue.push({ req, res, method: req.method });
  next();
};

// Set up routes for getting messages, sending messages, and deleting messages
router.route('/api/messages')
  .get(pushToQueueMiddleware, processNextRequest);

router.route('/api/sendMessage')
  .post(pushToQueueMiddleware, processNextRequest);

router.route('/api/messages/:message_id')
  .delete(pushToQueueMiddleware, processNextRequest);

// Export the router for use in the main app
module.exports = router;
