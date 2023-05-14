// require and use express:
const express = require('express');
const router = express.Router();

// require and destructure the middleware:
const {isLoggedIn} = require("../middlewares/auth.middlewares")

// GET "/categories/" => Render a list of all categories:
router.get("/", isLoggedIn, (req, res, next) => {
    res.render("categories/list")
})

// Use dynamic routes to render different list of categories's list.

// export the routes:
module.exports = router;