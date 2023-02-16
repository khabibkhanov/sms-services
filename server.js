const express = require('express');
const http = require('http');
const ReconnectingWebSocket = require('ws');

const app = express()
const server = http.createServer(app);
const wss = new ReconnectingWebSocket.Server({ server });
wss.reconnectInterval = 60000

// Pass the wss instance to locals
app.locals.websockets = {
	wss,
	ReconnectingWebSocket
}
app.use(express.json());

app.use( function (req, res, next)  {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Headers', '*')
	next()	
})

app.get('/', function(req, res) {
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify('SMS Service'))
})


// load modules
const modules = require('./src/modules')

app.use( modules )

server.listen(process.env.PORT || 5000)