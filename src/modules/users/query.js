const GET_USERS = `
	SELECT 
		*
	FROM users
	WHERE deleted_at is false;
`

const DELETE_USER = `
	UPDATE users
	SET deleted_at = NOW()
	WHERE user_number = $1
	RETURNING *;
`

module.exports = {
	GET_USERS,
	DELETE_USER
}