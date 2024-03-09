var express = require('express');
var router = express.Router();
const path = require('path');
var pathname = path.join(__dirname, '../');
const { db } = require(pathname + "database/mysql");
const session = require('express-session');

//write your APIs; upload-post, delete-post, edit-post
router.post('/upload-post', express.urlencoded({ extended: true }), (req, res) => {
    //..................
})

//delete-post, edit-post...

module.exports = router;