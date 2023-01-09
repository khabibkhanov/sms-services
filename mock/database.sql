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
        user_created_at timestamptz default current_timestamp,
        user_deleted_at timestamptz default null
    );

    INSERT INTO users (
        user_number
    ) VALUES 
    ('998913574568'),
    ('998913574567'),
    ('998914574567');

    CREATE TABLE sms (
        sms_id serial unique,
        reciever_number varchar(12) not null references users(user_number),
        sms_text text not null,
        sms_created_at timestamptz default current_timestamp,
        sms_deleted_at timestamptz default null
    );

    INSERT INTO sms (
        reciever_number,
        sms_text
    ) VALUES 
    ('998914574567', 'hello server' ),
    ('998913574568', 'hello world' );

    INSERT INTO sms (reciever_number, sms_text)
	VALUES 
    ('998913574568', 'hello Borhter');