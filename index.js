const express = require("express");
const app = express();
const compression = require("compression");

const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("./db");

const csurf = require("csurf");

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(compression());
app.use(express.json());
app.use(express.static("public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        //note: check userId name once cookie written
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    console.log("req.body", req.body);
    var first_name = req.body.first;
    var last_name = req.body.last;
    var emailadd = req.body.email;
    var password = req.body.password;
    var pass;

    hash(password)
        .then((hashedPw) => {
            console.log("HashedPW in /register", hashedPw);
            pass = hashedPw;
            return pass;
            // once the user info is stored in the database you will want to store the user id in the cookie
        })
        .then((pass) => {
            console.log("hashed password", pass);

            db.addData(first_name, last_name, emailadd, pass)
                .then((results) => {
                    req.session.userId = results.rows[0].id;
                    console.log("userid", req.session.userId);
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("Error in post registration ", err);
                    res.json({ success: false });
                });
        });
});
app.post("/login", (req, res) => {
    console.log("req.body", req.body);

    let email = req.body.email;
    let password = req.body.password;
    console.log("shilpa", password);
    console.log("shilpa2", email);
    let dbpass;

    db.getpass(email)
        .then((result) => {
            console.log("password", result);
            dbpass = result.rows[0].password;
            id = result.rows[0].id;
            req.session.userId = result.rows[0].id;
            return dbpass;
            console.log("dbpassword", dbpass);
        })
        .then((dbpass) => {
            return compare(password, dbpass);
        })
        .then((match) => {
            console.log("match", match);
            if (match) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("error in login", err);
            res.json({ success: false });
        });
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
