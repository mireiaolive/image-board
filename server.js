const express = require("express");
const app = express();
const db = require("./db.js");

//by default this is going to look for a index.html file

app.use(express.static("./public"));
// this info would be coming from the database!

app.get("/home", (req, res) => {
    console.log("/ route has been hit");
    // res.json is how we send a response to the client / Vue
    db.getImages()
        .then((result) => {
            //console.log("we are checking for info");
            //console.log("let's see result", result.rows);
            //res.json is how we send a response to the client
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("err: ", err);
        });
});

app.listen(8080, () => console.log("Server is listening..."));
