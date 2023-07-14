const GET_USERS = `
	SELECT 
		*
	FROM users
	WHERE user_deleted_at = false;
`

const DELETE_USER = `
	UPDATE users 
	SET user_deleted_at = true 
	WHERE user_number = $1
		AND user_deleted_at = false;
`;
module.exports = {
	GET_USERS,
	DELETE_USER
}