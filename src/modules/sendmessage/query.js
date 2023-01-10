const SENDMESSAGE = `
    INSERT INTO sms (reciever_number, sms_text)
    VALUES ($1, $2);
`
const GETUSERNUMBER =`
    SELECT user_number
    FROM users
    WHERE user_number = $1;
`

const GETMESSAGES = `
    SELECT (
        sms_text, 
        sms_created_at
    )
    FROM sms
    WHERE reciever_number = $1
`

module.exports = {
	SENDMESSAGE,
    GETUSERNUMBER,
    GETMESSAGES
}