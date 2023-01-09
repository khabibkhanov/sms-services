SELECT * FROM users;
SELECT * FROM sms;

-- Authorization
INSERT INTO users (user_number)
VALUES ('998913574568')
ON CONFLICT (user_number) DO UPDATE SET user_number = '998913574568'
RETURNING user_number;

drop function insert_sms;

CREATE FUNCTION insert_sms(reciever_number VARCHAR, sms_text VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
  INSERT INTO SMS (reciever_number, sms_text)
  SELECT reciever_number, sms_text
  FROM users
  WHERE user_number = insert_sms.reciever_number
  RETURNING sms_text;
  RETURN 'Please log in first';
END;
$$ LANGUAGE plpgsql;

SELECT insert_sms('123456', 'Hello, world!');