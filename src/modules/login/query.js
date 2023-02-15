const GETUSERBYSECID =`
    SELECT user_number
    FROM users
    WHERE user_number = $1 AND secure_token = $2;
`

module.exports = {
    GETUSERBYSECID
}