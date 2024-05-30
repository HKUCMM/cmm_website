var express = require('express');
var router = express.Router();
const path = require('path');
var pathname = path.join(__dirname, '../');
const { db } = require(pathname + "database/mysql");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const AWS = require('aws-sdk');
const s3 = new AWS.S3();


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
  var s3Url = req.body.s3Url; // URL of the Markdown file in S3
  var authorID = req.session.userId;

  var post = 'INSERT INTO posts (title, s3_url, num_of_likes, time_created, author_id) VALUES (?, ?, ?, NOW(), ?)';
  db.query(post, [title, s3Url, 0, authorID], function(err, result) {
      if (err) {
          console.error('Error uploading post', err);
          res.status(500).send();
          return;
      }
      res.status(200).send();
  });
});

// Assuming you have a users table that stores user information
// Assuming you have a comments table that stores comments for posts

router.get('/view-all-post', async (req, res) => {
    const query = `
        SELECT 
            posts.post_id,
            posts.title,
            posts.time_created AS date,
            members.username AS author,
            posts.num_of_likes,
            COUNT(comments.comment_id) AS numOfcomments
        FROM 
            posts
        JOIN 
            members ON posts.author_id = members.member_id
        LEFT JOIN 
            comments ON posts.post_id = comments.post_id
        GROUP BY 
            posts.post_id, posts.title, posts.time_created, members.name, posts.num_of_likes
        ORDER BY 
            posts.time_created DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving posts', err);
            res.status(500).send();
            return;
        }
        
        res.json(results);
    });
});

router.get('/view-post/:post_id', async (req, res) => {
    var postId = req.params.post_id;

    var query = 'SELECT s3_url FROM posts WHERE post_id = ?';
    db.query(query, [postId], function(err, results) {
        if (err) {
            console.error('Error fetching post', err);
            res.status(500).send();
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Post not found');
            return;
        }

        var s3Url = results[0].s3_url;
        var s3Params = {
            Bucket: process.env.S3_BUCKET_NAME, // Ensure this is set in your environment variables
            Key: s3Url
        };

        s3.getObject(s3Params, (err, data) => {
            if (err) {
                console.error('Error fetching file from S3', err);
                res.status(500).send();
                return;
            }

            var markdownContent = data.Body.toString('utf-8');
            res.send(markdownContent);
        });
    });
});

// upload-post
// router.post('/upload-post', express.urlencoded({ extended: true }), (req, res) => {
//     var title = req.body.title;
//     var content = req.body.content;
//     var authorID = req.session.userId;

//     var post = 'INSERT INTO posts (content, title, num_of_likes, time_created, author_id) VALUES (?, ?, ?, NOW(), ?)';
//     db.query(post,[content, title, 0, authorID], function(err,result){
//         if (err) {
//             console.error('Error uploading post', err);
//             res.status(500).send();
//             return;
//         }
//         res.status(200).send();
//     });

// });

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