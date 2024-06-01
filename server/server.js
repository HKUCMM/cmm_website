const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

const { swaggerUi, specs } = require('./modules/swagger');
var user_router = require('./routes/user');
var content_router = require('./routes/content')
var comment_router = require('./routes/comment')
var session = require('express-session');
require('dotenv').config();

app.set('view engine', 'ejs');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use('/', user_router);
app.use('/', content_router);
app.use('/', comment_router);

var server = app.listen(process.env.PORT, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
})
