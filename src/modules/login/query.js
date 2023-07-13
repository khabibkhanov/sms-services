// This query fetches the user_number from the database for a given secure_token
const GETUSERBYSECID =`
    SELECT user_number
    FROM users
    WHERE user_number = $1 AND secure_token = $2 AND user_deleted_at = false;
`

module.exports = {
    GETUSERBYSECID
}