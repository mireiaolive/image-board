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
    return db.query(
        `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING url`,
        [title, description, username, url]
    );
};

module.exports.imageId = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

module.exports.getComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [id]);
};

module.exports.addComment = (image_id, comment_post, username) => {
    return db.query(
        `INSERT INTO comments (image_id, comment_post, username) VALUES ($1, $2, $3) RETURNING image_id, comment_post, username `,
        [image_id, comment_post, username]
    );
};
