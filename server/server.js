const express = require("express");
const sampleRoute = require("./routes/sample_route");
const app = express();

app.use("/api/sample", sampleRoute);

app.listen(5000, () => { console.log("Server started on port 5000!") });
