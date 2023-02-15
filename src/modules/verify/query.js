const VALIDATE = `
	INSERT INTO users (user_number, fcm_token, secure_token)
	VALUES ($1, $2, $3)
	ON CONFLICT ( user_number ) DO UPDATE SET fcm_token = $2, user_updated_at = current_timestamp, secure_token = $3
	RETURNING user_number, secure_token;
`

module.exports = {
	VALIDATE
}