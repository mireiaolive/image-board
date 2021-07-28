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
    // res.json is how we send a response to the client
    db.getImages()
        .then(({ rows }) => {
            console.log("we are checking for info");
            //console.log("let's see result", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("err: ", err);
            res.sendStatus(500);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("request body", req.body, "request file", req.file);
    //concatenate the url that is the amazon url + the filename
    db.getUploaded(
        req.body.title,
        req.body.description,
        req.body.username,
        `https://s3.amazonaws.com/spicedling/${req.file.filename}`
    )
        .then((result) => {
            //res.json is how we send a response to the client
            res.json({
                title: req.body.title,
                description: req.body.description,
                username: req.body.username,
                url: result.rows[0].url,
            });
        })
        .catch((err) => console.log("err", err));
});
/*  if (!req.file) {
                console.log("file is not there!");
                res.sendStatus(500);
            } else {
                console.log("here it works");
            } */

app.get("/selection", (req, res) => {
    console.log("get request looking for id");
    //we have to do a query to look for the image id
    db.imageId(req.query.id)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("err", err);
        });
});

app.listen(8080, () => console.log("Server is listening..."));
