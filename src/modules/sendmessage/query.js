const SENDMESSAGE = `
    INSERT INTO sms (reciever_number, sms_text, sender)
    VALUES ($1, $2, $3);
`
const GETUSER =`
    SELECT user_number, fcm_token
    FROM users
    WHERE user_number = $1;
`

const GETMESSAGES = `
    SELECT (
        sender,
        sms_text, 
        sms_created_at
    )
    FROM sms
    WHERE reciever_number = $1;
`

module.exports = {
	SENDMESSAGE,
    GETUSER,
    GETMESSAGES
}