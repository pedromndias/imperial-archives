// require and use express:
const express = require('express');
const router = express.Router();

// GET "/categories/" => Render a list of all categories:
router.get("/", (req, res, next) => {
    res.render("categories/list")
})

// Use dynamic routes to render different list of categories's list.

// export the routes:
module.exports = router;