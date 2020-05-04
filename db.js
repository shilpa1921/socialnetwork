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
