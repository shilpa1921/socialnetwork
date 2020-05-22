const express = require("express");
const app = express();
const compression = require("compression");

const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("./db");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

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

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
app.get("/logout", (req, res) => {
    req.session.userId = null;
    console.log("id in logout", req.session.userId);
    res.redirect("/");
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
                        res.json({ duplicate: true });
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
                    let subject = "Change Password link";
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

        db.archiveProfilePic(id, url).then((results) => {
            console.log("pic archive worked");
        });
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
app.post("/saveUserBio", async (req, res) => {
    let user_id = req.session.userId;
    let bio = req.body.draftBio;
    console.log("bio in index", req.body);
    try {
        const results = await db.saveUserBio(user_id, bio);
        console.log("saveUserBio results", results);

        res.json(results.rows[0]);
    } catch (err) {
        console.log("error in saveUserBio", err);
    }
}); //end of saveUserBio

app.post("/user/:id", (req, res) => {
    console.log("id in other profile", req.params.id);
    let id = req.params.id;

    if (id == req.session.userId) {
        res.json({ selfuser: true });
    } else {
        db.getUser(id)
            .then((result) => {
                console.log("result in /user:id: ", result.rows[0]);
                if (result.rows[0] == undefined) {
                    res.json({ noMatch: true });
                }
                res.json(result.rows[0]);
            })
            .catch((err) => {
                console.log("ERROR in /user:id getUserInfo: ", err);
            });
    }
});

app.post(`/friendshipstatus/:id`, (req, res) => {
    console.log("id in  friendshipstatus", req.params.id);
    db.friendshipmatch(req.session.userId, req.params.id).then((result) => {
        console.log("result in friendshipstatus", result);
        if (result.rowCount == 0) {
            res.json({ text: " Make friend request" });
        } else if (
            result.rows[0].accepted === false &&
            result.rows[0].sender_id == req.params.id
        ) {
            res.json({ text: "Accept Friend Request" });
        } else if (
            result.rows[0].accepted === false &&
            result.rows[0].receiver_id == req.params.id
        ) {
            res.json({ text: "Cancel Friend Request" });
        } else {
            res.json({ text: "End Friendship" });
        }
    });
});

app.post("/friendship/:id", (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    console.log("This is the text: ", text);
    if (text == " Make friend request") {
        return db
            .addFriendsRow(id, req.session.userId)
            .then(({ rows }) => {
                console.log("db.addFriendsRow was succesful: ", rows);
                res.json({ text: "Cancel Friend Request" });
            })
            .catch((err) => {
                console.log("Error in db.addFriendsRow: ", err);
            });
    } else if (text == "Cancel Friend Request" || text == "End Friendship") {
        return db
            .cancelFriend(id, req.session.userId)
            .then(() => {
                console.log("cancel friend is success");
                res.json({ text: " Make friend request" });
            })
            .catch((err) => {
                console.log("Error in cancelFriend: ", err);
            });
    } else if (text == "Accept Friend Request") {
        return db
            .acceptFriend(id, req.session.userId)
            .then(() => {
                console.log("updation is  successful!");
                res.json({ text: "End Friendship" });
            })
            .catch((err) => {
                console.log("Error in acceptFriend: ", err);
            });
    }
});

app.post("/findpeople", (req, res) => {
    console.log("shilpa in find people", req.body.user);
    let id = req.session.userId;
    if (req.body.user) {
        db.getMatchingActors(req.body.user, id).then((results) => {
            console.log("results in findpeople search", results.rows);
            res.json(results.rows);
        });
    } else {
        db.recentjoiners(id).then((result) => {
            console.log("results in findpeople", result.rows);
            res.json(result.rows);
        });
    }
});

app.post("/pendingfriends", async (req, res) => {
    console.log("/pendingfriends route hit");
    let userId = req.session.userId;
    try {
        const results = await db.getFriends(userId);
        console.log("results.rows in pending friends", results.rows);
        res.json({ allfriends: results.rows });
    } catch (err) {
        console.log("error in pendingfriends", err);
    }
});
app.post("/deleteacoount:id", (req, res) => {
    console.log("/deleteacoount route hit", req.params.id);
    var user_id = req.params.id;
    db.getAllPics(user_id)
        .then((result) => {
            let picsInAws = result.rows;

            let picArr = [];

            let objects = picsInAws.map((item) => {
                let object = {
                    Key: item.pic_url,
                };
                picArr.push(object);
            });

            picArr = picArr.map((item) => {
                return {
                    Key: item.Key.replace(
                        "https://s3.amazonaws.com/spicedling/",
                        ""
                    ),
                };
            });

            s3.delete(picArr, function (err, data) {
                if (err) {
                    console.log(
                        "index.js error in s3 delete: ",
                        err,
                        err.stack
                    );
                }
            });
        })
        .then(() => {
            db.deletepicInprofilepic(user_id).then((result) => {
                console.log("result in profilepic", result);
            });
        })
        .then(() => {
            db.deleteChat(user_id).then((result) => {
                console.log("result in deletechat", result);
            });
        })
        .then(() => {
            db.deleteFriends(user_id).then((result) => {
                console.log("result im deletefriends", result);
            });
        })
        .then(() => {
            db.deleteuser(user_id).then((result) => {
                console.log("result im deleteresetcode", result);
                req.session = null;
                res.json(result.rows);
            });
        });
});

server.listen(8080, function () {
    console.log("I'm listening.");
});

let onlineUsers = {};

io.on("connection", function (socket) {
    console.log(`socket with the id ${socket.id} is now connected`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    onlineUsers[socket.id] = userId;
    console.log("onlineUsers", onlineUsers);

    var onlineUserIds = Object.values(onlineUsers);
    console.log("onlineUserIds", onlineUserIds);
    socket.on("disconnect", function () {
        delete onlineUsers[socket.id];

        onlineUserIds = Object.values(onlineUsers);
        db.getUsersByIds(onlineUserIds).then((data) => {
            console.log("DATA.rows in getUsersById", data.rows);

            io.sockets.emit("peopleOnline", data.rows);
        });
    });

    console.log("onlineUserIds", onlineUserIds);
    db.getUsersByIds(onlineUserIds).then((data) => {
        console.log("DATA.rows in getUsersById", data.rows);

        io.sockets.emit("peopleOnline", data.rows);
    });

    db.getLastMessages().then(({ rows }) => {
        console.log("Rows: ", rows);
        let lastMsgs = rows.reverse(rows);
        io.sockets.emit("chatMessages", lastMsgs);
    });

    socket.on("my amazing chat messeges", (newMsg) => {
        console.log("this msg comming from chat.js", newMsg);
        console.log("userId of sender", userId);

        return db
            .addChat(newMsg, userId)
            .then((res) => {
                console.log("result in addChat", res.rows[0]);
                let msginfo = {
                    chats_id: res.rows[0].id,
                    msg: res.rows[0].msg,
                    user_id: res.rows[0].user_id,
                    created_at: res.rows[0].created_at,
                };

                db.getUser(userId).then((result) => {
                    console.log("results in getuser info in chat", result);
                    let userAndChatInfo = {
                        ...msginfo,
                        first_name: result.rows[0].first_name,
                        last_name: result.rows[0].last_name,
                        pic_url: result.rows[0].pic_url,
                    };
                    io.sockets.emit("chatMessage", userAndChatInfo);
                });
            })
            .catch((err) => {
                console.log("err in addChat db", err);
            });
    });
});
