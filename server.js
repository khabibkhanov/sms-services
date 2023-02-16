const express = require('express')
// const session = require('express-session');
const app = express()

app.use(express.json());

// Use the express-session middleware to store session data
// app.use(session({
// 	secret: 'insmooniac',
// 	resave: false,
// 	saveUninitialized: true
// }));

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

app.listen(process.env.PORT || 5000)