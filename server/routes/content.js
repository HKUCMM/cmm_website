var express = require("express");
var router = express.Router();
const path = require("path");
var pathname = path.join(__dirname, "../");
const { getConnection } = require(pathname + "database/mysql");

// Update the /upload-post route
router.post("/upload-post", express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  var title = req.body.title;
  var content = req.body.content;
  var authorID = req.session.userId;

  let connection;
  try {
    connection = await getConnection();
    var post = "INSERT INTO posts (title, content, num_of_likes, time_created, author_id) VALUES (?, ?, ?, NOW(), ?)";
    await connection.query(post, [title, content, 0, authorID]);
    res.status(200).send();
  } catch (err) {
    console.error("Error uploading post", err);
    res.status(500).send();
  } finally {
    if (connection) connection.release();
  }
});

// Update the /view-post/:postId/like-post route
router.get("/view-post/:postId/like-post", express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  var memberId = req.session.userId;
  var postId = req.params.postId;

  let connection;
  try {
    connection = await getConnection();
    const checkLikeQuery = "SELECT * FROM member_likes_post WHERE member_id = ? AND post_id = ?";
    const [checkLikeResults] = await connection.query(checkLikeQuery, [memberId, postId]);

    if (checkLikeResults.length > 0) {
      // Member has already liked the post, so dislike it
      await connection.query("DELETE FROM member_likes_post WHERE member_id = ? AND post_id = ?", [memberId, postId]);
      await connection.query("UPDATE posts SET num_of_likes = GREATEST(num_of_likes - 1, 0) WHERE post_id = ?", [postId]);
    } else {
      // Member has not liked the post, so like it
      await connection.query("INSERT INTO member_likes_post (member_id, post_id) VALUES (?, ?)", [memberId, postId]);
      await connection.query("UPDATE posts SET num_of_likes = num_of_likes + 1 WHERE post_id = ?", [postId]);
    }

    // Get the updated like count
    const [updatedLikes] = await connection.query("SELECT num_of_likes FROM posts WHERE post_id = ?", [postId]);
    const newLikeCount = updatedLikes[0].num_of_likes;

    return res.status(200).json({ likes: newLikeCount });
  } catch (err) {
    console.error("Error updating like status", err);
    return res.status(500).send("Internal Server Error");
  } finally {
    if (connection) connection.release();
  }
});

// Update the /view-all-post route
router.get("/view-all-post", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  const query = `
    SELECT 
        posts.post_id AS postId,
        posts.title,
        DATE_FORMAT(posts.time_created, '%Y-%m-%d %H:%i:%s') AS date,
        CONCAT(M.name_first, ' ', M.name_last)  AS author,
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

  let connection;
  try {
    connection = await getConnection();
    const [results] = await connection.query(query);
    res.status(200).send(results);
  } catch (err) {
    console.error("Error retrieving posts", err);
    res.status(500).send();
  } finally {
    if (connection) connection.release();
  }
});

// Update the /view-post/:postId route
router.get("/view-post/:postId", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  var postId = req.params.postId;

  var postQuery = "SELECT P.title, P.num_of_likes AS numOfLikes, P.time_created AS timeCreated, CONCAT(M.name_first, ' ', M.name_last) AS author, P.content FROM posts P JOIN members M ON P.author_id = M.member_id WHERE post_id = ?";
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

  let connection;
  try {
    connection = await getConnection();
    const [postResults] = await connection.query(postQuery, [postId]);
    const [likesResults] = await connection.query(likesQuery, [postId]);
    const numOfLikes = likesResults.length > 0 ? likesResults[0].numOfLikes : 0;
    const response = {
      ...postResults[0],
      numOfLikes: numOfLikes,
    };
    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching data", err);
    res.status(500).send();
  } finally {
    if (connection) connection.release();
  }
});

// Update the /edit-post/:postId route
router.put("/edit-post/:postId", express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  const userId = req.session.userId;

  var postId = req.params.postId;
  var title = req.body.title;
  var editedContent = req.body.content;

  let connection;
  try {
    connection = await getConnection();
    const [authResults] = await connection.query("SELECT author_id AS authorId FROM posts WHERE post_id = ?", [postId]);
    if (authResults.length === 0) {
      return res.status(404).send("Post not found");
    }
    if (authResults[0].authorId !== userId) {
      return res.status(401).send("Unauthorized to edit this post");
    }

    const [updateResult] = await connection.query("UPDATE posts SET title = ?, content = ? WHERE post_id = ?", [title, editedContent, postId]);
    if (updateResult.affectedRows === 0) {
      return res.status(404).send("No post found or no changes made.");
    }
    res.status(200).send("Content updated successfully");
  } catch (err) {
    console.error("Error updating post", err);
    return res.status(500).send("Error updating content");
  } finally {
    if (connection) connection.release();
  }
});

// Update the /delete-post/:postId route
router.delete("/delete-post/:postId", express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  const postId = req.params.postId;
  const userId = req.session.userId;

  let connection;
  try {
    connection = await getConnection();
    const [checkResults] = await connection.query("SELECT author_id AS authorId FROM posts WHERE post_id = ?", [postId]);
    if (checkResults.length === 0) {
      return res.status(404).send("Post not found");
    }
    if (checkResults[0].authorId !== userId) {
      return res.status(403).send("You do not have permission to delete this post");
    }

    await connection.query("DELETE FROM posts WHERE post_id = ?", [postId]);
    res.status(200).send("Post deleted successfully");
  } catch (err) {
    console.error("Error deleting post", err);
    res.status(500).send();
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;