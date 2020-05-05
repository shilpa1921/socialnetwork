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
        WHERE id=$1`,
        [user_id, url]
    );
};
