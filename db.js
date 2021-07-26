var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    console.log("insert images");
    return db.query(`SELECT * FROM images`);
};

module.exports.getUploaded = (title, description, username, fullUrl) => {
    return db.query(
        `INSERT INTO images (title, description, username, fullUrl) VALUES ($1, $2, $3, $4)`,
        [title, description, username, fullUrl]
    );
};
