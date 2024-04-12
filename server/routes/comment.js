var express = require('express');
var router = express.Router();
const path = require('path');
var pathname = path.join(__dirname, '../');
const { db } = require(pathname + "database/mysql");
const session = require('express-session');

//upload comment, use session variable ex) session.req.userId
router.post('/upload-comment', express.urlencoded({ extended: true}), async (req, res) => {

});

//edit comment
router.put('/edit-comment', express.urlencoded({ extended: true}), async (req, res) => {

});

//delete comment
router.get('/delete-comment', express.urlencoded({ extended: true}), async (req, res) => {

});

module.exports = router;
