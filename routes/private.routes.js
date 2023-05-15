// require and use express:
const express = require('express');
const router = express.Router();

// Require the User Model:
const User = require("../models/User.model");

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
    User.findById(req.session.user._id)
    .populate("favoriteCharacter")
    .then((singleUser) =>{
        const {username, favoriteCharacter} = singleUser
        console.log(username, favoriteCharacter)
        res.render("private/profile", {
            username,
            favoriteCharacter
        })
    })
    .catch((err) =>{
        next(err)
    })
    
    // todo add favorite character when "Add to favorite" button favorite.
})
// todo continue investigation to add favorite:
router.post("/profile/:characterId", (req, res, next) => {
    console.log(req.params.characterId, req.session.user._id)
    User.findByIdAndUpdate(req.session.user._id, {favoriteCharacter: req.params.characterId})
    .then(() =>{
        console.log("Added favourite Character")
        /* req.session.user.favoriteCharacter = req.params.characterId */ //? Ask jorge 
        res.redirect("/private/profile/")

    })
    .catch((error) =>{
        next(error)
    })

})

// export it:
module.exports = router;