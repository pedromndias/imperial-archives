// require and use express:
const express = require('express');
const router = express.Router();

// require and destructure the middleware:
const {isLoggedIn} = require("../middlewares/auth.middlewares")

// GET "/private/main" => Render 2 cards with links for Chategories and Categories:
// Note the middleware isLoggedIn that verifies if there is a req.session.user.
router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("private/main")
})


// GET "/private/profile" => Render user's profile:
router.get("/profile/", isLoggedIn, (req, res, next) => {
    console.log(req.session.user);
    const {username, favoriteCharacter} = req.session.user
    res.render("private/profile", {
        username,
        favoriteCharacter
    })
    // how to transfer user's info to hbs. Sessions?
    
    // Find by id and render.
    // todo add favorite character when "Add to favorite" button favorite.
})
// todo continue investigation to add favorite:
// router.post("/profile/:character", (req, res, next) => {
//     console.log(req.params.character)
// })

// export it:
module.exports = router;