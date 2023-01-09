const VALIDATE = `
	INSERT INTO users (user_number)
	VALUES ($1)
	ON CONFLICT (user_number) DO UPDATE SET user_number = $1
	RETURNING user_number;
`

module.exports = {
	VALIDATE
}