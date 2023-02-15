const express = require('express')
const session = require('express-session');
const app = express()

app.use(express.json());

app.get('/', function(req, res) {
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify('SMS Service'))
})

// load modules
const modules = require('./src/modules')

app.use( modules )

app.listen(process.env.PORT || 5000)