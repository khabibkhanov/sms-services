const express = require('express');
const ws = require('ws');
const winston = require('winston');
const expressWinston = require('express-winston');
const rateLimit = require('express-rate-limit');

const app = express();

// Create an instance of the Express app
const server = app.listen(process.env.PORT || 35000, () => {
  console.log(`Express app listening on port ${process.env.PORT || 35000}`);
});

// Create a new WebSocket server using the 'noServer' option
const wss = new ws.Server({ noServer: true });

// Pass the wss instance to the app.locals object, so it can be accessed by other modules
app.locals.websockets = {
  wss,
};

// Create a rate limiter middleware
const limiter = rateLimit({
  windowMs: 1000, // 1 minute
  max: 1, // Max number of requests allowed in the window
  message: 'Too many requests from this IP, please try again later.',
});

// Use the built-in Express middleware for parsing JSON data
app.use(express.json());

// Set CORS headers to allow cross-origin requests from any origin and any headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Set up request logger middleware using Winston
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/access.log' }),
  ],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
  expressFormat: true,
  colorize: true,
}));

// Create a simple HTTP route that returns a JSON response with a message
app.get('/', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify('SMS Service is working'));
});

// Load external modules for handling various routes and functionality
const modules = require('./src/modules');
app.use(modules, limiter);

// Override the default console log method to use a Winston logger that logs to a file
console.log = function () {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => {
        return `${info.timestamp} - ${info.message}`;
      })
    ),
    transports: [
      new winston.transports.File({ filename: 'logs/console.log' }),
    ],
  });

  logger.info.apply(logger, arguments);
}

// Handle the upgrade process for WebSocket communication
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

// Log when the WebSocket server is listening
wss.on('listening', () => {
  console.log(`WebSocket server listening on port ${process.env.PORT || 35000}`);
});
wss.on('error', error => {
  console.error(`WebSocket server error: ${error}`);
});