const express = require('express');
const app = express();
const { swaggerUi, specs } = require('./modules/swagger');
var userRouter = require('./routes/user');
var contentRouter = require('./routes/content');
var commentRouter = require('./routes/comment');
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
app.use('/', userRouter);
app.use('/', contentRouter);
app.use('/', commentRouter);

const port = process.env.PORT;

var server = app.listen(port, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})
