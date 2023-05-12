const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// require our auth routes files:
const authRouter = require("./auth.routes")
// and use them:
router.use("/auth", authRouter)

module.exports = router;
