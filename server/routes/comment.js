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

/**
 * @swagger
 * /get-comments/{post_id}:
 *   get:
 *     summary: Retrieve comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: Numeric ID of the post to retrieve comments.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 likes:
 *                   type: integer
 *                   description: Number of likes on the post.
 */
router.get('/get-comments/:postId', express.urlencoded({ extended: true }), async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).send('Unauthorized');
    }

    var postId = req.params.postId;
    var commentsQuery = 'SELECT DATE_FORMAT(C.time_created, \'%Y-%m-%d %H:%i:%s\') AS timeCreated, C.content , CONCAT(M.\`name.first\`, \' \', M.\`name.last\`) AS author FROM comments C JOIN members M ON  C.commenter_id = M.member_id WHERE post_id = ?';
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
        const [commentsResults] = await db.promise().query(commentsQuery, [postId]);
        const [likesResults] = await db.promise().query(likesQuery, [postId]);

        const response = {
            comments: commentsResults,
            likes: likesResults.length > 0 ? likesResults[0].numOfLikes : 0
        };

        res.json(response);
    } catch (err) {
        console.error('Error fetching data', err);
        res.status(500).send();
    }
});

/**
 * @swagger
 * /upload-comment:
 *   post:
 *     summary: Upload a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: integer
 *                 description: The ID of the post to comment on.
 *               content:
 *                 type: string
 *                 description: The content of the comment.
 *     responses:
 *       201:
 *         description: Comment uploaded successfully.
 *       401:
 *         description: Unauthorized access.
 */
router.post('/upload-comment', express.urlencoded({ extended: true }), async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).send('Unauthorized');
    }

    const { postId, content } = req.body;
    const commenterId = req.session.userId;
    const timeCreated = new Date(); 

    const insertQuery = `
        INSERT INTO comments (post_id, commenter_id, content, time_created)
        VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [postId, commenterId, content, timeCreated], (err, results) => {
        if (err) {
            console.error('Failed to insert comment', err);
            return res.status(500).send('Failed to upload comment');
        }
        res.status(201).send('Comment uploaded successfully');
    });
});

/**
 * @swagger
 * /edit-comment:
 *   put:
 *     summary: Edit a comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: integer
 *                 description: The ID of the comment to edit.
 *               content:
 *                 type: string
 *                 description: The new content of the comment.
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *       404:
 *         description: No comment found or you do not have permission to edit this comment.
 */
router.put('/edit-comment', express.urlencoded({ extended: true }), async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).send('Unauthorized');
    }

    const { comment_id, content } = req.body;

    if (!comment_id || !content) {
        return res.status(400).send('Comment ID and content are required');
    }

    const updateQuery = `
        UPDATE comments
        SET content = ?
        WHERE comment_id = ? AND commenter_id = ?
    `;

    db.query(updateQuery, [content, comment_id, req.session.userId], (err, result) => {
        if (err) {
            console.error('Failed to update comment', err);
            return res.status(500).send('Failed to update comment');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('No comment found or you do not have permission to edit this comment');
        }
        res.send('Comment updated successfully');
    });
});

/**
 * @swagger
 * /delete-comment:
 *   get:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: comment_id
 *         required: true
 *         description: Numeric ID of the comment to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *       404:
 *         description: No comment found or you do not have permission to delete this comment.
 */
router.get('/delete-comment', express.urlencoded({ extended: true }), async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).send('Unauthorized');
    }

    const commentId  = req.query.commentId;

    if (!commentId) {
        return res.status(400).send('Comment ID is required');
    }

    const deleteQuery = `
        DELETE FROM comments
        WHERE comment_id = ? AND commenter_id = ?
    `;

    db.query(deleteQuery, [commentId, req.session.userId], (err, result) => {
        if (err) {
            console.error('Failed to delete comment', err);
            return res.status(500).send('Failed to delete comment');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('No comment found or you do not have permission to delete this comment');
        }
        res.send('Comment deleted successfully');
    });
});

module.exports = router;