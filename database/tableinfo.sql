 
  DROP TABLE IF EXISTS users;
   DROP TABLE IF EXISTS reset_codes;
   CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
       pic_url TEXT,
        bio VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

 CREATE TABLE reset_codes(
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  code VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    receiver_id INT NOT NULL REFERENCES users(id),
    sender_id INT NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT FALSE
);


CREATE TABLE chat(
  id SERIAL PRIMARY KEY,
   msg VARCHAR(500),
  user_id INT NOT NULL REFERENCES users(id),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

 
);

DROP TABLE IF EXISTS profilepics;

CREATE TABLE profilepics (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL  REFERENCES users(id),
    pic_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);












