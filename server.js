const express = require('express')
const app = express()
const WebSocket = require('ws');
const http = require('http')
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
console.log(WebSocket.OPEN);
app.use(express.json());

app.get('/', function(req, res) {
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify('SMS Service'))
})

// load modules
const modules = require('./src/modules')

app.use( modules )

app.listen(process.env.PORT || 5000)