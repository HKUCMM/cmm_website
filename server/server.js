const express = require("express");
const app = express();

// Sample get request
app.get("/user", (req, res) => {
    res.json({ "users": ["userOne", "userTwo", "userThree"] });
    console.log("api called");
});

app.listen(5000, () => { console.log("Server started on port 5000!") });
