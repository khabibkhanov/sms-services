require('dotenv').config();

const PORT = process.env.PORT || 5000
const admin = require('firebase-admin');

const pgConfig = {
	host: process.env.PGHOST,
	port: process.env.PGPORT,
	user: process.env.PGUSER,	
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE
}

const firebaseConfig = {
	type: process.env.FIREBASE_TYPE,
	project_id: process.env.FIREBASE_PROJECT_ID,
	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
	private_key: process?.env?.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	client_email: process.env.FIREBASE_CLIENT_EMAIL,
	client_id: process.env.FIREBASE_CLIENT_ID,
	auth_uri: process.env.FIREBASE_AUTH_URI,
	token_uri: process.env.FIREBASE_TOKEN_URI,
	auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
	client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

const firebaseAdmin = admin.initializeApp({
	credential: admin.credential.cert(firebaseConfig),
	databaseURL: {"smsservices-e6622-default-rtdb": process.env.FIREDATABASE}
});

module.exports = { 
	pgConfig,
	PORT,
	firebaseAdmin
}