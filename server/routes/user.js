const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const pathname = path.join(__dirname, "../");
const { getConnection } = require(pathname + "database/mysql");

const pbkdf2_iterations = 10371;

function checkPassword(userPassword, userSalt, passwordAttempt) {
  const hash = crypto.createHash("sha512");
  hash.update(passwordAttempt + userSalt);

  return hash.digest("hex") === userPassword;
}

function createHash(userPassword) {
  const hash = crypto.createHash("sha512");
  hash.update(userPassword);

  return hash.digest("hex");
}

// Middleware to establish database connection
// router.use(async (req, res, next) => {
//   try {
//     req.db = await connectToDatabase();
//     next();
//   } catch (err) {
//     console.error("Failed to connect to the database:", err);
//     res.status(500).json({ error: "Database connection failed" });
//   }
// });

/**
 * @swagger
 * /session:
 *   get:
 *     summary: Retrieves session data
 *     description: Returns JSON containing session information, including user ID and email if the user is logged in.
 *     responses:
 *       200:
 *         description: Session data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLoggedIn:
 *                   type: boolean
 *                   description: Indicates whether the user is currently logged in.
 *                 userId:
 *                   type: string
 *                   description: The unique identifier of the logged-in user.
 *                 email:
 *                   type: string
 *                   description: The email address of the logged-in user.
 *       401:
 *         description: Unauthorized. User is not logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLoggedIn:
 *                   type: boolean
 *                   description: Indicates that the user is not logged in.
 */
router.get("/session", (req, res) => {
  // Check if the user is logged in
  if (req.session.userId) {
    res.json({
      isLoggedIn: true,
      userId: req.session.userId,
      email: req.session.email,
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});

/**
 * @swagger
 * paths:
 *  /changepw:
 *    post:
 *      summary: Change password
 *      tags:
 *        - user
 *      description: Change Password
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          properties:
 *            userId:
 *              type: integer
 *            newPassword:
 *              type: string
 *      responses:
 *        200:
 *          description: password change successful
 *          schema:
 *            properties:
 *              message:
 *                type: string
 *        401:
 *          description: password change unsuccessful
 *          schema:
 *            properties:
 *              message:
 *                type: string
 */
//based on session userId variable, delete the old passowrd (provided by admin), update hashed password
router.post(
  "/changepw",
  express.urlencoded({ extended: true }),
  async (req, res) => {
    const newPassword = req.body.newPassword;
    const queryA = `SELECT salt FROM members WHERE member_id = ? `;

    db.query(queryA, [req.session.userId], function (err, results) {
      if (err) {
        res.status(404).send();
      } else {
        const userSalt = results[0].salt;
        const queryB = `UPDATE members SET hashed_password = ? WHERE member_id = ?`;
        db.query(
          queryB,
          [createHash(newPassword + userSalt), req.body.userId],
          function (err, results) {
            if (err) {
              res.status(401).send();
            } else {
              res.status(200).send("updated successfully");
            }
          }
        );
      }
    });
  }
);

/**
 * @swagger
 * paths:
 *  /login:
 *    post:
 *      summary: Login new user, set session variable
 *      tags:
 *        - user
 *      description: User log-in
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          properties:
 *            loginEmail:
 *              type: string
 *            loginPW:
 *              type: string
 *      responses:
 *        200:
 *          description: login successful
 *          schema:
 *            properties:
 *              message:
 *                type: string
 *        401:
 *          description: login failed
 *          schema:
 *            properties:
 *              message:
 *                type: string
 */

router.post("/login", express.urlencoded({ extended: true }), async (req, res) => {
  const { loginEmail, loginPassword } = req.body;
  let connection;

  try {
    connection = await getConnection();
    const query = `SELECT member_id, name_first, name_last, email, is_admin, team_id, salt, hashed_password FROM members WHERE email = ?`;
    const [results] = await connection.execute(query, [loginEmail]);

    if (results.length === 0) {
      return res.status(401).json({ message: "No user found" });
    }

    const user = results[0];
    const verified = checkPassword(user.hashed_password, user.salt, loginPassword);

    if (verified) {
      req.session.email = loginEmail;
      req.session.userId = user.member_id;
      res.status(200).json({
        firstName: user.name_first,
        lastName: user.name_last,
        isAdmin: user.is_admin,
      });
    } else {
      res.status(401).json({ message: "Login information incorrect" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "An error occurred during login" });
  } finally {
    if (connection) connection.release();
  }
});
/**
 * @swagger
 * paths:
 *  /logout:
 *    get:
 *      summary: Logout user, set session variable to null
 *      tags:
 *        - user
 *      description: User log-out
 *      responses:
 *        200:
 *          description: logout successful
 *        401:
 *          description: logout failed
 */
router.get("/logout", (req, res) => {
  req.session.loginName = null;
  req.session.userId = null;
  if (!req.session.loginEmail && !req.session.userId) {
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});

module.exports = router;
