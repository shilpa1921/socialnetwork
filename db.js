const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.addData = (first_name, last_name, emailadd, password) => {
    return db.query(
        `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES($1, $2, $3, $4) RETURNING id`,
        [first_name, last_name, emailadd, password]
    );
};

module.exports.getpass = (email) => {
    return db
        .query(`SELECT * FROM users WHERE email = $1;`, [email])
        .then((results) => {
            console.log("result from getpass in db.js", results);
            return results;
        })
        .catch((err) => {
            console.log("errrrrrrr", err);
        });
};

module.exports.addCode = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING email;`,
        [email, code]
    );
};

module.exports.checkCode = (email) => {
    return db.query(
        `SELECT * FROM reset_codes WHERE (CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes') AND (email = $1) ORDER BY id DESC LIMIT 1;`,
        [email]
    );
};

module.exports.updatePassword = (email, password) => {
    return db.query(`UPDATE users SET password = $2 WHERE email = $1;`, [
        email,
        password,
    ]);
};

module.exports.saveProfilePic = (user_id, url) => {
    return db.query(
        `UPDATE users
        SET pic_url = $2
        WHERE id=$1 RETURNING *`,
        [user_id, url]
    );
};
module.exports.getUser = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1;`, [id]);
};

module.exports.saveUserBio = (user_id, bio) => {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id=$1
        RETURNING bio`,
        [user_id, bio]
    );
};

module.exports.recentjoiners = (id) => {
    return db.query(
        `SELECT * FROM users WHERE id != $1 ORDER BY id DESC LIMIT 3`,
        [id]
    );
};

module.exports.getMatchingActors = (val, id) => {
    return db.query(
        `SELECT * FROM USERS WHERE id != $2 AND first_name ILIKE $1;`,
        [val + "%", id]
    );
};

module.exports.friendshipmatch = (userId, id) => {
    return db.query(
        `SELECT * FROM friendships WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1)`,
        [userId, id]
    );
};

module.exports.addFriendsRow = (receiver_id, sender_id) => {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id) VALUES ($1, $2) RETURNING *;`,
        [receiver_id, sender_id]
    );
};

module.exports.acceptFriend = (receiver_id, sender_id) => {
    return db.query(
        `UPDATE friendships SET accepted = TRUE 
        WHERE (receiver_id = $1 AND sender_id = $2) 
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};

module.exports.cancelFriend = (receiver_id, sender_id) => {
    return db.query(
        `DELETE FROM friendships WHERE 
        (receiver_id = $1 AND sender_id = $2) 
        OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};

// SELECT * FROM friendships
// WHERE (receiver_id = $1 AND sender_id = $2)
// OR (receiver_id = $2 AND sender_id = $1)
module.exports.getFriends = (userId) => {
    return db.query(
        `SELECT users.id, first_name, last_name, pic_url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [userId]
    );
};

module.exports.addChat = (newMsg, userId) => {
    return db.query(
        `
    INSERT INTO chat (msg, user_id)
    VALUES($1, $2) RETURNING *`,
        [newMsg, userId]
    );
};

module.exports.getLastMessages = () => {
    return db.query(
        `SELECT chat.id AS chats_id, first_name, last_name, pic_url, msg, user_id, chat.created_at 
        FROM users
        JOIN chat 
        ON users.id = user_id ORDER BY chat.id DESC LIMIT 10;`
    );
};
