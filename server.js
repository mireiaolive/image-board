const express = require("express");
const app = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
//by default this is going to look for a index.html file

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

app.use(express.static("./public"));
// this info comes from the database

app.use(express.json());

app.get("/home", (req, res) => {
    //console.log("/ route has been hit");
    // res.json is how we send a response to the client / Vue
    db.getImages()
        .then(({ rows }) => {
            console.log("we are checking for info");
            //console.log("let's see result", rows);
            //res.json is how we send a response to the client
            res.json(rows);
        })
        .catch((err) => {
            console.log("err: ", err);
            res.sendStatus(500);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log(req.body, req, file);
    awsUrl = "https://s3.amazonaws.com/spicedling";
    const fullUrl = awsUrl + req.file;

    db.getUploaded(
        req.body.title,
        req.body,
        description,
        req.body.username,
        fullUrl
    )
        .then(({ rows }) => {
            console.log("what we see", rows);
        })
        .catch((err) => console.log("err", err));
});

app.listen(8080, () => console.log("Server is listening..."));
