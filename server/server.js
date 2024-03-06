const express = require("express");
const sampleRoute = require("./routes/sample_route");
const app = express();
require("dotenv").config();

app.use("/api/sample", sampleRoute);

app.listen(process.env.PORT, () => { console.log(`Server started on port ${process.env.PORT}!!`) });
