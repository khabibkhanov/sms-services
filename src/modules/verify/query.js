const VALIDATE = `
	WITH upsert AS (
		UPDATE users
		SET fcm_token = $2,
			user_updated_at = current_timestamp,
			secure_token = $3,
			user_created_at = CASE WHEN user_deleted_at = true THEN current_timestamp ELSE user_created_at END,
			user_deleted_at = CASE WHEN user_deleted_at = true THEN false ELSE user_deleted_at END
		WHERE user_number = $1
		RETURNING *
	)
	INSERT INTO users (user_number, fcm_token, secure_token, user_created_at, user_deleted_at)
	SELECT $1, $2, $3, current_timestamp, false
	WHERE NOT EXISTS (SELECT * FROM upsert)
	RETURNING user_number, secure_token;
`;

module.exports = {
    VALIDATE
};
