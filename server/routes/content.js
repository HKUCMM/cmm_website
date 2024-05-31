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


/**
 * @swagger
 * /upload-post:
 *   post:
 *     summary: Upload a new post
 *     tags: 
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *                 example: "My New Post"
 *               content:
 *                 type: string
 *                 description: The URL of the Markdown file in S3
 *                 example: "https://s3.amazonaws.com/mybucket/myfile.md"
 *     responses:
 *       200:
 *         description: Post uploaded successfully
 *       500:
 *         description: Internal server error
 */
router.post('/upload-post', express.urlencoded({ extended: true }), (req, res) => {
  var title = req.body.title;
  var content = req.body.content; // URL of the Markdown file in S3
  var authorID = req.session.userId;

  var post = 'INSERT INTO posts (title, content, num_of_likes, time_created, author_id) VALUES (?, ?, ?, NOW(), ?)';
  db.query(post, [title, content, 0, /**authorID */27], function(err, result) {
      if (err) {
          console.error('Error uploading post', err);
          res.status(500).send();
          return;
      }
      res.status(200).send();
  });
});

/**
 * @swagger
 * /view-all-post:
 *   get:
 *     summary: Retrieve all posts along with their authors and comment counts
 *     tags: 
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   post_id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "First Post"
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-05-30T12:34:56Z"
 *                   author:
 *                     type: string
 *                     example: "John Doe"
 *                   num_of_likes:
 *                     type: integer
 *                     example: 10
 *                   numOfcomments:
 *                     type: integer
 *                     example: 5
 *       500:
 *         description: Internal server error
 */
router.get('/view-all-post', async (req, res) => {
    const query = `
        SELECT 
            posts.post_id,
            posts.title,
            posts.time_created AS date,
            CONCAT(M.\`name.first\`, ' ', M.\`name.last\`)  AS author,
            posts.num_of_likes,
            COUNT(comments.comment_id) AS numOfcomments
        FROM 
            posts
        JOIN 
            members M ON posts.author_id = M.member_id
        LEFT JOIN 
            comments ON posts.post_id = comments.post_id
        GROUP BY 
            posts.post_id, posts.title, posts.time_created, author, posts.num_of_likes
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

/**
 * @swagger
 * /view-post/{post_id}:
 *   get:
 *     summary: Retrieve the content of a specific post
 *     tags: 
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: The content of the post in markdown format
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "# My Post\nThis is the content of the post."
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.get('/view-post/:post_id', async (req, res) => {
    var postId = req.params.post_id;

    var query = 'SELECT P.title, P.num_of_likes, P.time_created, CONCAT(M.\`name.first\`, \' \', M.\`name.last\`) AS author, P.content FROM posts P JOIN members M ON P.author_id = M.member_id WHERE post_id = ?';
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

        var markdownContent = results[0].content;
        console.log(markdownContent);
        res.json(results);
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