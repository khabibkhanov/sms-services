const express = require('express')
const session = require('express-session');
const { PORT, host } = require('./src/config')
const cookie = require('cookie-parser')
const app = express()


app.use(express.json());

// Use the express-session middleware to store session data
app.use(session({
	secret: 'insmooniac',
	resave: false,
	saveUninitialized: true
}));

// third-party and build-in middlewares
app.use( cookie() )
app.use( function (req, res, next)  {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Headers', '*')
	next()
})

// load modules
const modules = require('./src/modules')

app.use( modules )


app.listen(PORT, () => console.log(`${host}:${PORT}`))