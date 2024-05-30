var express = require('express');
var router = express.Router();
const path = require('path');
var pathname = path.join(__dirname, '../');
const { db } = require(pathname + "database/mysql");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    schema: {
      tableName: 'session',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
      }
    },
  }, db);


  router.use(session({
    secret: 'secretcmm',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
  }));


// upload-post
router.post('/upload-post', express.urlencoded({ extended: true }), (req, res) => {
    var title = req.body.title;
    var content = req.body.content;
    var authorID = req.session.userId;

    var post = 'INSERT INTO posts (content, title, num_of_likes, time_created, author_id) VALUES (?, ?, ?, NOW(), ?)';
    db.query(post,[content, title, 0, authorID], function(err,result){
        if (err) {
            console.error('Error uploading post', err);
            res.status(500).send();
            return;
        }
        res.status(200).send();
    });

});

// edit-post API: update the post with the given post_id with the new title and content
router.put('/edit/:post_id', express.urlencoded({ extended: true }), (req, res) => {
    var postId = req.params.post_id;
    var title = req.body.title;
    var editedContent = req.body.content;
    var query = 'UPDATE posts SET title = ?, content = ? WHERE post_id = ?';

    db.query(query, [title, editedContent, postId], function (err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error updating content");
        } else {
            res.status(200).send("Content updated successfully");
        }
    });
});

// delete-post

module.exports = router;