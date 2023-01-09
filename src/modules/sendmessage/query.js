const SENDMESSAGE = `
    INSERT INTO sms (reciever_number, sms_text)
    VALUES ($1, $2);
`
const GETUSERNUMBER =`
    SELECT user_number
    FROM users
    WHERE user_number = $1;
`

module.exports = {
	SENDMESSAGE,
    GETUSERNUMBER,
}