const host = 'http://192.168.0.87'
const PORT = process.env.PORT || 5000
const admin = require('firebase-admin');

const pgConfig = {
	host: 'localhost',
	port: 5432,
	user:'postgres',	
	password: '!Khan_0130',
	database: 'sms_service_db'
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