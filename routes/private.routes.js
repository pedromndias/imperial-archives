// require and use express:
const express = require('express');
const router = express.Router();

// GET "/private/main" => Render 2 cards with links for Chategories and Categories:
router.get("/main", (req, res, next) => {
    res.render("private/main")
})


// GET "/private/profile" => Render user's profile:
router.get("/profile", (req, res, next) => {
    res.render("private/profile")
    // how to transfer user's info to hbs. Sessions?
    console.log(req.session.user);
    // Find by id and render.
    // todo add detailed info from the user.
})

// export it:
module.exports = router;