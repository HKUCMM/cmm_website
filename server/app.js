var express = require('express');
var app = express();
var user_router = require('./routes/user');
var content_router = require('./routes/content')
//var display_router = require('./routes/display');
var session = require('express-session');

app.set('view engine', 'ejs');

app.use(
  session({
    secret: 'mysecretkey', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use('/', user_router);
app.use('/', content_router);

var server = app.listen(8081, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})