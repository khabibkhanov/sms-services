INSERT INTO users (
    user_number,
    user_password
) VALUES 
('998913574568', crypt('root', gen_salt('bf'))),
('998913574567', crypt('root', gen_salt('bf')));

INSERT INTO sms (
    sender_name,
    reciever_id,
    sms_text,
    sent_time
) VALUES 
('root', 2, 'hello server', '04-01-2022'),
('client', 1, 'hello world', '05-01-2022');

INSERT INTO users (
    user_number,
    user_password
) VALUES 
('998914574567', crypt('rooot', gen_salt('bf')));

INSERT INTO users (
    user_number,
    user_password
) VALUES 
('998914574567', crypt('rooot', gen_salt('bf')));