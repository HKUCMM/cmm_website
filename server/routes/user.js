var express = require('express');
var router = express.Router();
const path = require('path');
var pathname = path.join(__dirname, '../');
const { db } = require(pathname + "database/mysql");
const session = require('express-session');

/**
 * @swagger
 * /login:
 *   post:
 *    summary: User Login
 *    requestBody: {
 *      content: {
 *        "application/json": {
 *          schema: {
 *            properties: {
 *              loginName:{
 *                type: "string",
 *                description: "user email",
 *                example: "abc@example.com",
 *                },
 *              loginPW: {
 *                type: "string",
 *                description: "user password",
 *                example: "password123@",
 *                },
 *            },
 *          },
 *        },
 *      },
 *    },
 *    response: {
 *      200: {
 *        description: "login successful",
 *      },
 *    };
 * 
 */

router.get('/', (req, res) => {
  res.redirect('/login');
})

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
                  res.status(500).send('Error registering username.');
              } else {
                  res.status(200).send('Registered successfully');
              }
          });
        } 
    }); 
})


router.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  var loginName = req.body.loginName;
  req.session.loginName = loginName;
  var loginPW = req.body.loginPassword;
  req.session.loginPW = loginPW;
  var query = `SELECT * FROM USERS WHERE NAME = ?`;

  db.query(query, [loginName], function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    
    console.log(results[0])
    if (results[0]) {
      if (results[0].password == loginPW) {
        req.session.loginName = loginName;
        req.session.userId = results[0].ID;
        res.status(200).send('Success');
        return;
      }
    }
    res.status(404).send('404 Not Found');
  });
})

router.get('/logout', (req, res) => {
  req.session.loginName = null;
  req.session.userId = null;
  res.redirect('/');
})

module.exports = router;