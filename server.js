// Import necessary modules
const express = require('express'); // Express is a popular web framework for Node.js
const http = require('http'); // The HTTP module is built-in to Node.js and provides functionality for creating a basic HTTP server
const ReconnectingWebSocket = require('ws'); // A WebSocket library that provides automatic reconnection in case of connection failures
const winston = require('winston');
const expressWinston = require('express-winston');
// Create an instance of the Express app
const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a new WebSocket server using the HTTP server and the ReconnectingWebSocket library
const wss = new ReconnectingWebSocket.Server({ server });

// Set the reconnect interval to 60 seconds (in case of connection failures)
wss.reconnectInterval = 60000;

// Pass the wss instance and ReconnectingWebSocket library to the app.locals object, so they can be accessed by other modules
app.locals.websockets = {
	wss,
	ReconnectingWebSocket
};

// Use the built-in Express middleware for parsing JSON data
app.use(express.json());

// Set CORS headers to allow cross-origin requests from any origin and any headers
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

// set up request logger middleware using Winston
app.use(expressWinston.logger({
	transports: [
	  new winston.transports.Console(),
	  new winston.transports.File({ filename: 'logs/access.log' })
	],
	format: winston.format.combine(
	  winston.format.colorize(),
	  winston.format.json()
	),
	meta: true,
	msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
	expressFormat: true,
	colorize: true,
  }));

// Create a simple HTTP route that returns a JSON response with a message
app.get('/', function(req, res) {
	res.set('Content-Type', 'application/json');
	res.send(JSON.stringify('SMS Service is working'));
});

// Load external modules for handling various routes and functionality
const modules = require('./src/modules');
app.use(modules);

// Start the HTTP server, listening on the specified port (or defaulting to port 5000)
server.listen(process.env.PORT);