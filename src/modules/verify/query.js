const VALIDATE = `
	INSERT INTO users (user_number, fcm_token)
	VALUES ($1, $2)
	ON CONFLICT ( user_number ) DO UPDATE SET fcm_token = $2, user_updated_at = current_timestamp
	RETURNING user_number;
`

module.exports = {
	VALIDATE
}