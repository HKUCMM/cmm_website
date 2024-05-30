const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const pathname = path.join(__dirname, '../');
const { db } = require(pathname + "database/mysql");
const session = require('express-session');

// Middleware to enable session handling
router.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

const pbkdf2_iterations = 10371;

function checkPassword(userPassword, userSalt, passwordAttempt) {
  //const hashedPasswordAttempt = key.toString('hex');
  //console.log(key);
  const hash = crypto.createHash('sha512');
  hash.update(passwordAttempt+userSalt);
  
  return(hash.digest('hex') === userPassword);
}

function createHash(userPassword){
  const hash = crypto.createHash('sha512');
  hash.update(userPassword);

  return(hash.digest('hex'));
}

router.get('/', (req, res) => {
  res.redirect('/login');
})

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
router.get('/session', (req, res) => {
  // Check if the user is logged in
  if (req.session.userId) {
    res.json({
      isLoggedIn: true,
      userId: req.session.userId,
      email: req.session.email
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});

/**
 * @swagger
 * paths:
 *  /signup:
 *    post:
 *      tags:
 *        - user
 *      description: User signup
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          properties:
 *            signupEmail:
 *              type: string
 *            signupFirstName:
 *              type: string
 *            signupLastName:
 *              type: string
 *            signupPassword:
 *              type: string
 *            signupTeamNo:
 *              type: integer
 *            isAdmin:
 *              type: boolean
 *      responses:
 *        200:
 *          description: signup successful
 *          schema:
 *            properties:
 *              message:
 *                type: string
 *        401:
 *          description: user already exists
 *          schema:
 *            properties:
 *              message:
 *                type: string
 */
//based on session userId variable, delete the old passowrd (provided by admin), update hashed password
router.post('/changepw', express.urlencoded({ extended: true }), async (req, res) => {
  var newPassword = req.body.newPassword;
  var queryA = `SELECT salt FROM members WHERE member_id = ? `;
  var userSalt = '';
  db.query(queryA, [req.session.userId], function(err, results){
    if (err){
      res.status(404).send();
    } else{
      console.log(results[0]);
      userSalt = results[0].salt;
      
      var queryB = `UPDATE members SET hashed_password = ?, password = null WHERE member_id = ?`;
      db.query(queryB, [createHash(newPassword+userSalt), req.body.userId], function(err, results){
        if (err){
          res.status(401).send();
        } else{
          res.status(200).send('updated successfully');
        }
      });

    }
  });
});


/**
 * @swagger
 * paths:
 *  /login:
 *    post:
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

router.post('/login', express.urlencoded({ extended: true }), async (req, res) => {
  var loginEmail = req.body.loginEmail;
  var loginPassword = req.body.loginPassword;
  // First, check whether it is the first login, if true, redirect to changepw endpoint
  var queryA = `SELECT password FROM members WHERE email = ?`;
  try {
    const resultsA = await new Promise((resolve, reject) => {
      db.query(queryA, [loginEmail], function(err, results) {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (resultsA.length > 0 && resultsA[0].password === null) {
      res.redirect('/changepw');
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(404).send();
    return;
  }

  // Proceed with the main login check if the first login check passes without redirect
  var queryB = `SELECT member_id, \`name.first\`, \`name.last\`, email, password, is_admin, team_id, salt, hashed_password FROM members WHERE email = ?`;
  try {
    const resultsB = await new Promise((resolve, reject) => {
      db.query(queryB, [loginEmail], function(err, results) {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (resultsB.length === 0) {
      res.status(401).send('No user found');
      return;
    }
    console.log(resultsB[0].hashed_password, loginPassword)
    const verified = checkPassword(resultsB[0].hashed_password, resultsB[0].salt, loginPassword);

    if (verified) {
      req.session.email = loginEmail;
      req.session.userId = resultsB[0].member_id;
      res.status(200).send('login successful');
    } else {
      res.status(401).send('login info incorrect');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});



/**
 * @swagger
 * paths:
 *  /logout:
 *    get:
 *      tags:
 *        - user
 *      description: User log-out
 *      responses:
 *        200:
 *          description: logout successful
 *        401:
 *          description: logout failed
 */
router.get('/logout', (req, res) => {
  req.session.loginName = null;
  req.session.userId = null;
  if(!req.session.loginEmail){
    res.status(200).send();
  }
  else{
    res.status(404).send();
  }
  //res.redirect('/');
})

module.exports = router;
