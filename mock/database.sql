CREATE DATABASE sms_service_db;
CREATE EXTENSION pgcrypto;

/*
	1. Users
    2. messages
*/

CREATE TABLE users (
    user_id serial primary key,
    user_number varchar(12) not null,
    user_password varchar(256) not null,
	user_created_at timestamptz default current_timestamp,
	user_deleted_at timestamptz default null
);

CREATE TABLE sms (
    sms_id serial primary key,  
    sender_name varchar(256) not null,
    reciever_id int references users(user_id),
    sms_text text not null,
    sent_time varchar(100) not null,
    sms_created_at timestamptz default current_timestamp,
    sms_deleted_at timestamptz default null
);