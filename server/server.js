var express = require('express');
var app = express();
const { swaggerUi, specs } = require('./modules/swagger');
var user_router = require('./routes/user');
var content_router = require('./routes/content')
//var display_router = require('./routes/display');
var session = require('express-session');
require('dotenv').config();

app.set('view engine', 'ejs');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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

const port = process.env.PORT;

var server = app.listen(port, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})
