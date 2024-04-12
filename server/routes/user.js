const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const pathname = path.join(__dirname, '../');
const { db } = require(pathname + "database/mysql");
const session = require('express-session');

const createSalt = () => {
  return new Promise((resolve, reject) => {
      crypto.randomBytes(64, (err, buf) => {
          if (err) {
              reject(err);
          } else {
              resolve(buf.toString("base64"));
          }
      });
  });
};

const pbkdf2_iterations = 10371;
const createHashedPassword = async (password) => {
  const salt = await createSalt();
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, pbkdf2_iterations, 64, "sha512", (err, key) => {
      if (err) {
        reject(err);
        return;
      }
      const hashedPassword = key.toString("base64");
      resolve({ hashedPassword, salt });
    });
  });
};

const verifyPassword = async (userPassword, userSalt, passwordAttempt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(passwordAttempt, userSalt, pbkdf2_iterations, 64, "sha512", (err, key) => {
      if (err) {
        reject(err);
        return;
      }
      const hashedPasswordAttempt = key.toString('hex');
      //console.log(key);
      const hash = crypto.createHash('sha512');
      hash.update(passwordAttempt+userSalt);
      resolve(hash.digest('hex') === userPassword);
    });
  });
};

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




/*
router.post('/signup', express.urlencoded({ extended: true }), (req,res) =>{
    var signupEmail = req.body.signupEmail;
    var signupFirstName = req.body.signupFirstName;
    var signupLastName = req.body.signupLastName;
    var signupPassword = req.body.signupPassword;
    var signupTeamNo = req.body.signupTeamNo;
    var isAdmin = req.body.isAdmin;

    var duplicateEmailQuery = "SELECT * FROM members WHERE email = ?"
    //var duplicateNameQuery = "SELECT * FROM USERS WHERE NAME = ?";
    
    db.query(duplicateEmailQuery, [signupEmail], function(err, emailResults){
        if(err){
            console.log(err);
            return;
        }
        if(emailResults.length > 0){
            res.send("An account with the same email already exists. Please login with your email");
        } else {
            
          var user = "INSERT INTO members (`name.first`, `name.last`, email, password, is_admin, team_id) VALUES (?, ?, ?, ?, ?, ?);";
          db.query(user, [signupFirstName, signupLastName, signupEmail, signupPassword, isAdmin, signupTeamNo], function(err, result) {
              if (err) {
                  console.error('Error inserting record:', err);
                  res.status(500).send();
              } else {
                  res.status(200).send();
              }
          });
        } 
    }); 
})*/

router.post('/changepw', express.urlencoded({ extended: true }), async (req, res) => {
  var newPassword = req.body.newPassword;
  //console.log(req.session.userId);
  var queryA = `SELECT salt FROM members WHERE member_id = ? `;
  var userSalt = '';
  db.query(queryA, [req.body.userId], function(err, results){
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
  var loginPassword = req.body.loginPW;
  //check whether it is first login, if true, redirect to changepw endpoint
  var queryA = `SELECT password FROM members WHERE email = ?`;
  db.query(queryA, [loginEmail], function(err, results){
    if(err){
      res.status(404).send();
    }
    else if(results){
      redirect('/changepw');
      return;
    }
  });


  var query = `SELECT member_id, \`name.first\`, \`name.last\`, email, password, is_admin, team_id, salt, hashed_password FROM members WHERE email = ?`;
  try {
      const results = await new Promise((resolve, reject) => {
          db.query(query, [loginEmail], function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
                //console.log(results);
            }
          });
      });

      //const verified = await verifyPassword(results[0].hashed_password, results[0].salt, loginPassword);
      const verified = checkPassword(results[0].hashed_password, results[0].salt, loginPassword);

      if (verified) {
          req.session.email = loginEmail;
          req.session.userId = results.member_id;

          res.status(200).send('login succsessful');
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
