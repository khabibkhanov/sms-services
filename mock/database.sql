CREATE DATABASE sms_service_db;
CREATE EXTENSION pgcrypto;

/*
	1. Users
    2. messages
*/

DROP TABLE sms;

DROP TABLE users;

CREATE TABLE users (
    user_id serial unique,
    user_number varchar(12) not null primary key,
    fcm_token varchar(255) not null,
    user_created_at timestamptz default current_timestamp,
    user_updated_at timestamptz default null,
    user_deleted_at boolean default f
);

INSERT INTO users (
    user_number,
    fcm_token
) VALUES 
('998913574567', 'chiiaY_tS5qpbVXFqpp-_A:APA91bH9Nl_boivxWw46EOvHko-Vq0Swy8eVmmpgXw0yDL1R-1vU47cs5gMiGTF7PenvJSDU1jTgkMylnxnXCVXSk7_43I9memCHwPbLhK_ZVYeOBMbsu8h6w4eWp0EsmP4yhz7ZJohj'),
('998914574567', 'chiiaY_tS5qpbVXFqpp-_A:APA91bH9Nl_boivxWw46EOvHko-Vq0Swy8eVmmpgXw0yDL1R-1vU47cs5gMiGTF7PenvJSDU1jTgkMylnxnXCVXSk7_43I9memCHwPbLhK_ZVYeOBMbsu8h6w4eWp0EsmP4yhz7ZJohj');

CREATE TABLE sms (
    sms_id serial unique,
    reciever_number varchar(12) not null references users(user_number),
    sms_text text not null,
    sender varchar(16) not null,
    sms_created_at timestamptz default current_timestamp,
    sms_deleted_at boolean default false
);

INSERT INTO sms (
    reciever_number,
    sender,
    sms_text
) VALUES    
('998914574567', 'notarius', 'hello server' ),
('998913574567', 'government', 'hello world' );

UPDATE sms 
    SET sms_deleted_at = true 
    WHERE sms_id = 7 AND reciever_number = '998914574567'
RETURNING sms_deleted_at;



INSERT INTO sms (
    reciever_number,
    sender,
    sms_text
) VALUES    
('998913574568', 'government', 'hello world' ),
('998913574568', 'government', 'hello world' ),
('998913574568', 'government', 'hello world' ),
('998913574568', 'government', 'hello world' ),
('998913574568', 'government', 'hello world' ),
('998913574568', 'government', 'hello world' ),
('998913574568', 'government', 'hello world' ),
('998913574568', 'government', 'hello world' ),
('998913574568', 'government', 'hello world' );