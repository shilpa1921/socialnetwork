const express = require("express");
const app = express();
const compression = require("compression");

const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("./db");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string");

const csurf = require("csurf");
const s3 = require("./s3");
const config = require("./config.json");
const multer = require("multer");
const path = require("path");
const uidSafe = require("uid-safe");
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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
    console.log("req.body.password", req.body.password);
    var pass;
    if (req.body.password) {
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
    } else {
        res.json({ success: false });
    }
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
            // req.session.userId = result.rows[0].id;
            return dbpass;
            console.log("dbpassword", dbpass);
        })
        .then((dbpass) => {
            return compare(password, dbpass);
        })
        .then((match) => {
            console.log("match", match);
            if (match) {
                req.session.userId = id;
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

app.post("/resetpassword/step1", (req, res) => {
    console.log("req.body", req.body);
    let email = req.body.email;
    db.getpass(req.body.email)
        .then((result) => {
            console.log("result in get paass step1", result);
            dbpass = result.rows[0].password;
            id = result.rows[0].id;
            console.log("shilpaaaaa122345", dbpass, id, result.rows[0].email);
            const secretCode = cryptoRandomString({
                length: 6,
            });
            db.addCode(email, secretCode)
                .then((result) => {
                    console.log("added code successfully", result);
                    let to = result.rows[0].email;
                    let subject = "Change Password lonk";
                    let text =
                        "This is the  code for your password reset: " +
                        secretCode;
                    console.log("info of send email", to, subject, text);
                    ses.sendEmail(to, subject, text);

                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("error in adding code to table", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("error in get pass", err);
            res.json({ success: false });
        });
});
app.post("/upload-img", uploader.single("file"), s3.upload, (req, res) => {
    console.log("file", req.file.filename);
    console.log("id in upload-img", req.session.userId);

    if (req.file) {
        let filename = req.file.filename;
        let url = config.s3Url + filename;
        let id = req.session.userId;
        console.log("json", config.s3Url + filename);
        db.saveProfilePic(id, url)
            .then((result) => {
                console.log("url added successfully", result);
                let image = {
                    imageUrl: result.rows[0].pic_url,
                };
                console.log("Image object: ", image);
                res.json(image);
            })
            .catch((err) => {
                console.log("Error in db.addAvatar: ", err);
                res.json({ success: false });
            });
    } else {
        res.json({
            success: false,
        });
    }
});

app.post("/user", (req, res) => {
    console.log("req.session.userId: ", req.session.userId);

    db.getUser(req.session.userId)
        .then((result) => {
            console.log("result in /user: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("ERROR in /user getUserInfo: ", err);
        });
});

app.post("/resetpassword/verify", (req, res) => {
    let { email, code, password } = req.body;
    db.checkCode(email)
        .then(({ rows }) => {
            if (code === rows[0].code) {
                hash(password)
                    .then((hashedPw) => {
                        db.updatePassword(email, hashedPw)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("Error in update password: ", err);
                            });
                    })
                    .catch((err) => {
                        console.log("Error in hash: ", err);
                    });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("Error in db.checkCode: ", err);
        });
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
