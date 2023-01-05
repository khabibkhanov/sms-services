const express = require('express')
const { PORT, host } = require('./src/config')
// const PORT = 4500

const app = express()
app.use(express.json());

app.use( function (req, res, next)  {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Headers', '*')
	next()
})

// load modules
const modules = require('./src/modules')
app.use( modules )


app.listen(PORT, () => console.log('http://localhost:' + PORT))