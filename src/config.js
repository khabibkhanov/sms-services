const dotenv = require('dotenv').config();
const host = 'http://192.168.0.87'

const PORT = process.env.PORT || 5000
const admin = require('firebase-admin');

const pgConfig = {
		url: process.env.PGDATABASE_URL,
		host: process.env.PGHOST,
		port: process.env.PGPORT,
		user: process.env.PGUSER,	
		password: process.env.PGPASSWORD,
		database: process.env.PGDATABASE	
	
}

const firebaseAdmin = admin.initializeApp({
	credential: admin.credential.cert(require('./services/programmsoft-sms-service.json')),
	databaseURL: process.env.FIREDATABASE
});

module.exports = { 
	pgConfig,
	PORT,
	host,
	firebaseAdmin
}