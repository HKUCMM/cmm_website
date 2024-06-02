var express = require("express");
var router = express.Router();
const path = require("path");
var pathname = path.join(__dirname, "../");
const { db } = require(pathname + "database/mysql");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

// const sessionStore = new MySQLStore(
//   {
//     clearExpired: true,
//     checkExpirationInterval: 900000,
//     expiration: 86400000,
//     createDatabaseTable: true,
//     schema: {
//       tableName: "session",
//       columnNames: {
//         session_id: "session_id",
//         expires: "expires",
//         data: "data",
//       },
//     },
//   },
//   db
// );

// router.use(
//   session({
//     secret: "secretcmm",
//     resave: false,
//     saveUninitialized: true,
//     store: sessionStore,
//   })
// );

/**
 * @swagger
 * paths:
 *   /upload-post:
 *     post:
 *       summary: Upload a new post
 *       tags:
 *         - Posts
 *       description: Upload a new post
 *       parameters:
 *         - in: body
 *           name: body
 *           required: true
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *                 example: "My New Post"
 *               content:
 *                 type: string
 *                 description: The content of the post
 *                 example: "Hello world"
 *       responses:
 *         200:
 *           description: Post uploaded successfully
 *         500:
 *           description: Internal server error
 */
router.post(
  "/upload-post",
  express.urlencoded({ extended: true }),
  (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).send("Unauthorized");
    }

    var title = req.body.title;
    var content = req.body.content;
    var authorID = req.session.userId;

    var post =
      "INSERT INTO posts (title, content, num_of_likes, time_created, author_id) VALUES (?, ?, ?, NOW(), ?)";
    db.query(post, [title, content, 0, authorID], function (err, result) {
      if (err) {
        console.error("Error uploading post", err);
        res.status(500).send();
        return;
      }
      res.status(200).send();
    });
  }
);

/**
 * @swagger
 * /view-post/{postId}/like-post:
 *   get:
 *     summary: Like or dislike a post
 *     description: Toggles the like status of a post for the authenticated user. If the post is already liked, it will be disliked, and vice versa. The number of likes on the post will be updated accordingly.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to like or dislike
 *     responses:
 *       200:
 *         description: Post like status updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example:
 *                 oneOf:
 *                   - Post liked successfully
 *                   - Post disliked successfully
 *       401:
 *         description: Unauthorized - User is not logged in
 *         schema:
 *           type: string
 *           example: Unauthorized
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           type: string
 *           example: Internal Server Error
 */
router.get(
  "/view-post/:postId/like-post",
  express.urlencoded({ extended: true }),
  async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).send("Unauthorized");
    }

    var memberId = req.session.userId;
    var postId = req.params.postId;

    const checkLikeQuery =
      "SELECT * FROM member_likes_post WHERE member_id = ? AND post_id = ?";
    const likePostQuery =
      "INSERT INTO member_likes_post (member_id, post_id) VALUES (?, ?)";
    const dislikePostQuery =
      "DELETE FROM member_likes_post WHERE member_id = ? AND post_id = ?";
    const incrementLikesQuery =
      "UPDATE posts SET num_of_likes = num_of_likes + 1 WHERE post_id = ?";
    const decrementLikesQuery =
      "UPDATE posts SET num_of_likes = GREATEST(num_of_likes - 1, 0) WHERE post_id = ?";

    try {
      const [checkLikeResults] = await db
        .promise()
        .query(checkLikeQuery, [memberId, postId]);

      if (checkLikeResults.length > 0) {
        // Member has already liked the post, so dislike it
        await db.promise().query(dislikePostQuery, [memberId, postId]);
        await db.promise().query(decrementLikesQuery, [postId]);
        return res.status(200).json({ message: "Post disliked successfully" });
      } else {
        // Member has not liked the post, so like it
        await db.promise().query(likePostQuery, [memberId, postId]);
        await db.promise().query(incrementLikesQuery, [postId]);
        return res.status(200).json({ message: "Post liked successfully" });
      }
    } catch (err) {
      console.error("Error updating like status", err);
      return res.status(500).send("Internal Server Error");
    }
  }
);

/**
 * @swagger
 * paths:
 *   /view-all-post:
 *     get:
 *       summary: Get all posts
 *       tags:
 *         - Posts
 *       description: Retrieve all posts along with their authors and comment counts
 *       responses:
 *         200:
 *           description: A list of posts
 *           schema:
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "First Post"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-05-30T12:34:56Z"
 *               author:
 *                 type: string
 *                 example: "John Doe"
 *               numOfLikes:
 *                 type: integer
 *                 example: 10
 *               numOfComments:
 *                 type: integer
 *                 example: 5
 *         500:
 *           description: Internal server error
 *           schema:
 *             properties:
 *               message:
 *                 type: string
 *                 example: "An error occurred while retrieving posts."
 */
router.get("/view-all-post", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  const query = `
        SELECT 
            posts.post_id AS postId,
            posts.title,
            DATE_FORMAT(posts.time_created, \'%Y-%m-%d %H:%i:%s\') AS date,
            CONCAT(M.\`name.first\`, ' ', M.\`name.last\`)  AS author,
            posts.num_of_likes AS numOfLikes,
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
      console.error("Error retrieving posts", err);
      res.status(500).send();
      return;
    }
    res.status(200).send(results);
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
 *         schema:
 *           properties:
 *             content:
 *               type: string
 *               example: "# My Post\nThis is the content of the post."
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 *         schema:
 *           properties:
 *             message:
 *               type: string
 *               example: "An error occurred while retrieving the post."
 */
router.get("/view-post/:postId", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  var postId = req.params.postId;

  var postQuery =
    "SELECT P.title, P.num_of_likes AS numOfLikes, P.time_created AS timeCreated, CONCAT(M.`name.first`, ' ', M.`name.last`) AS author, P.content FROM posts P JOIN members M ON P.author_id = M.member_id WHERE post_id = ?";
  var likesQuery = `
    SELECT 
        COUNT(member_id) AS numOfLikes 
    FROM 
        member_likes_post
    WHERE 
        post_id = ?
    GROUP BY 
        post_id
    `;

  try {
    const [postResults] = await db.promise().query(postQuery, [postId]);
    const [likesResults] = await db.promise().query(likesQuery, [postId]);
    const numOfLikes = likesResults.length > 0 ? likesResults[0].numOfLikes : 0;
    const response = {
      ...postResults[0],
      numOfLikes: numOfLikes,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching data", err);
    res.status(500).send();
  }
});

/**
 * @swagger
 * /edit-post/{post_id}:
 *   put:
 *     summary: Updates an existing post
 *     description: Allows the user to update the title and content of their own post. The user must be logged in and must be the author of the post.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the post
 *               content:
 *                 type: string
 *                 description: The new content of the post
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       401:
 *         description: Unauthorized if user is not logged in or is not the author of the post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error when trying to update the post
 */
router.put(
  "/edit-post/:postId",
  express.urlencoded({ extended: true }),
  (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).send("Unauthorized");
    }
    const userId = req.session.userId;

    var postId = req.params.postId;
    var title = req.body.title;
    var editedContent = req.body.content;

    const authQuery =
      "SELECT author_id AS authorId FROM posts WHERE post_id = ?";
    db.query(authQuery, [postId], (err, results) => {
      if (err) {
        console.error("Error checking post authorization", err);
        return res.status(500).send("Error checking post authorization");
      }
      if (results.length === 0) {
        return res.status(404).send("Post not found");
      }
      if (results[0].authorId !== userId) {
        return res.status(401).send("Unauthorized to edit this post");
      }

      // Update post if the user is the author
      const query = "UPDATE posts SET title = ?, content = ? WHERE post_id = ?";
      db.query(query, [title, editedContent, postId], function (err, result) {
        if (err) {
          console.error("Error updating post", err);
          return res.status(500).send("Error updating content");
        }
        if (result.affectedRows === 0) {
          return res.status(404).send("No post found or no changes made.");
        }
        res.status(200).send("Content updated successfully");
      });
    });
  }
);

/**
 * @swagger
 * /delete-post/{post_id}:
 *   delete:
 *     summary: Deletes a post
 *     description: Allows the user to delete their own post or an admin to delete any post. The operation requires the user to be logged in and, if not an admin, to be the author of the post.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized if the user is not logged in
 *       403:
 *         description: Forbidden if the user is not the author or an admin
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error when trying to delete the post
 */
router.delete(
  "/delete-post/:postId",
  express.urlencoded({ extended: true }),
  (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).send("Unauthorized");
    }

    const postId = req.params.postId;
    const userId = req.session.userId;

    // Check if the user is the author of the post or an admin
    const queryCheck =
      "SELECT author_id AS authorId FROM posts WHERE post_id = ?";
    db.query(queryCheck, [postId], (err, results) => {
      if (err) {
        console.error("Error fetching post", err);
        res.status(500).send();
        return;
      }

      if (results.length === 0) {
        res.status(404).send("Post not found");
        return;
      }

      if (results[0].authorId !== userId) {
        res.status(403).send("You do not have permission to delete this post");
        return;
      }

      const deleteQuery = "DELETE FROM posts WHERE post_id = ?";
      db.query(deleteQuery, [postId], (err, result) => {
        if (err) {
          console.error("Error deleting post", err);
          res.status(500).send();
          return;
        }
        res.status(200).send("Post deleted successfully");
      });
    });
  }
);

module.exports = router;
