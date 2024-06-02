require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: `${process.env.CORS_ORIGIN}/${process.env.PORT}`,
    credentials: true,
  })
);

const { swaggerUi, specs } = require("./modules/swagger");
var userRouter = require("./routes/user");
var contentRouter = require("./routes/content");
var commentRouter = require("./routes/comment");
var session = require("express-session");

app.set("view engine", "ejs");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use("/", userRouter);
app.use("/", contentRouter);
app.use("/", commentRouter);

var server = app.listen(process.env.PORT, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
