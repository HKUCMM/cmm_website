const { sample } = require("../controllers/sample");

const router = require("express").Router();

router.get("/user", sample);

module.exports = router;