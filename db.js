var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    console.log("insert images");
    return db.query(`SELECT * FROM images`);
};

module.exports.getUploaded = (title, description, username, url) => {
    console.log("upload images");
    return db.query(
        `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING url`,
        [title, description, username, url]
    );
};

module.exports.imageId = (id) => {
    return db.query(`SELECT * FROM images WHERE Id = &{id}`);
};
