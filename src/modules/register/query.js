const VALIDATE = `
	INSERT INTO users (
        u.user_number,
        u.user_password
    ) VALUES 
    (
        $1,
        crypt($2, )
    )
`

module.exports = {
	VALIDATE,
}