const VALIDATE = `
	WITH upsert AS (
		UPDATE users SET fcm_token = $2, user_updated_at = current_timestamp, secure_token = $3
		WHERE user_number = $1
		RETURNING *
	)
	INSERT INTO users (user_number, fcm_token, secure_token)
	SELECT $1, $2, $3
	WHERE NOT EXISTS (SELECT * FROM upsert)
	RETURNING user_number, secure_token;
`

module.exports = {
	VALIDATE
}