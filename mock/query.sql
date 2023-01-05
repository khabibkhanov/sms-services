SELECT * FROM users;
SELECT * FROM sms;

SELECT 
    u.user_number
FROM users u
WHERE u.user_number = $1 AND 
u.user_password = crypt($2, u.user_password);