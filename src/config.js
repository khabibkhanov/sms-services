const host = 'localhost'
const PORT = process.env.PORT || 5000

const pgConfig = {
	host: 'localhost',
	port: 5432,
	user:'postgres',
	password: '!Khan_0130',
	database: 'sms_service_db'
}

module.exports = { 
	pgConfig,
	PORT,
	host,
}