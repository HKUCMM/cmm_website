const express = require('express');
const app = express();
const { swaggerUi, specs } = require('./modules/swagger');
const user_router = require('./routes/user');
const content_router = require('./routes/content')
//var display_router = require('./routes/display');
const session = require('express-session');

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

var server = app.listen(process.env.PORT, () => {
    console.log(`Listening at port ${process.env.PORT}`);
})
