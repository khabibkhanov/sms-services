const SENDMESSAGE = `
    INSERT INTO sms (reciever_number, sms_text, sender)
    VALUES ($1, $2, $3)
    RETURNING sms_id;
`
const GETUSER =`
    SELECT user_number, fcm_token
    FROM users
    WHERE user_number = $1;
`

const GETMESSAGES = `
    SELECT sms_id, sender, sms_text, sms_created_at
    FROM sms
    WHERE reciever_number = $1 AND sms_deleted_at = false;
`

const DELETEMESSAGE = `
    UPDATE sms 
    SET sms_deleted_at = 
        CASE 
            WHEN (sms_deleted_at = false) 
            THEN true 
            ELSE sms_deleted_at 
        END
    WHERE sms_id = $1 AND reciever_number = $2
    AND sms_deleted_at = false
    RETURNING 
        CASE 
            WHEN (sms_deleted_at = true) 
            THEN 'Message deleted successfully' 
        END;
`

module.exports = {
	SENDMESSAGE,
    GETUSER,
    GETMESSAGES,
    DELETEMESSAGE
}