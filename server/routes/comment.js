var express = require("express");
var router = express.Router();
const path = require("path");
var pathname = path.join(__dirname, "../");
const { getConnection } = require(pathname + "database/mysql");

router.get("/get-comments/:postId", express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  var postId = req.params.postId;
  var commentsQuery = "SELECT DATE_FORMAT(C.time_created, '%Y-%m-%d %H:%i:%s') AS timeCreated, C.content , CONCAT(M.name_first, ' ', M.name_last) AS author FROM comments C JOIN members M ON  C.commenter_id = M.member_id WHERE post_id = ?";

  let connection;
  try {
    connection = await getConnection();
    const [commentsResults] = await connection.query(commentsQuery, [postId]);
    res.status(200).send(commentsResults);
  } catch (err) {
    console.error("Error fetching data", err);
    res.status(500).send();
  } finally {
    if (connection) connection.release();
  }
});

router.post("/upload-comment", express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  const { postId, content } = req.body;
  const commenterId = req.session.userId;
  const timeCreated = new Date();

  const insertQuery = `
    INSERT INTO comments (post_id, commenter_id, content, time_created)
    VALUES (?, ?, ?, ?)
  `;

  let connection;
  try {
    connection = await getConnection();
    await connection.query(insertQuery, [postId, commenterId, content, timeCreated]);
    res.status(201).send("Comment uploaded successfully");
  } catch (err) {
    console.error("Failed to insert comment", err);
    res.status(500).send("Failed to upload comment");
  } finally {
    if (connection) connection.release();
  }
});

router.put("/edit-comment", express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  const { comment_id, content } = req.body;

  if (!comment_id || !content) {
    return res.status(400).send("Comment ID and content are required");
  }

  const updateQuery = `
    UPDATE comments
    SET content = ?
    WHERE comment_id = ? AND commenter_id = ?
  `;

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(updateQuery, [content, comment_id, req.session.userId]);
    if (result.affectedRows === 0) {
      return res.status(404).send("No comment found or you do not have permission to edit this comment");
    }
    res.send("Comment updated successfully");
  } catch (err) {
    console.error("Failed to update comment", err);
    res.status(500).send("Failed to update comment");
  } finally {
    if (connection) connection.release();
  }
});

router.get("/delete-comment", express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  const commentId = req.query.commentId;

  if (!commentId) {
    return res.status(400).send("Comment ID is required");
  }

  const deleteQuery = `
    DELETE FROM comments
    WHERE comment_id = ? AND commenter_id = ?
  `;

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(deleteQuery, [commentId, req.session.userId]);
    if (result.affectedRows === 0) {
      return res.status(404).send("No comment found or you do not have permission to delete this comment");
    }
    res.send("Comment deleted successfully");
  } catch (err) {
    console.error("Failed to delete comment", err);
    res.status(500).send("Failed to delete comment");
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;