require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { swaggerUi, specs } = require("./modules/swagger");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const userRouter = require("./routes/user");
const contentRouter = require("./routes/content");
const commentRouter = require("./routes/comment");

app.use("/", userRouter);
app.use("/", contentRouter);
app.use("/", commentRouter);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});