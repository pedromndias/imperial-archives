// require and use express:
const express = require('express');
const router = express.Router();

// Require the User Model:
const User = require("../models/User.model");
// Require the Character Model:
const Character = require("../models/Character.model");

// require and destructure the middleware:
const {isLoggedIn} = require("../middlewares/auth.middlewares");
const capitalize = require('../utils/capitalize');

// GET "/private/main" => Render 2 cards with links for Chategories and Categories:
// Note the middleware isLoggedIn that verifies if there is a req.session.user.
router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("private/main")
})


// GET "/private/profile" => Render user's profile:
router.get("/profile/", isLoggedIn, (req, res, next) => {
    // console.log(req.session.user);
    User.findById(req.session.user._id)
    .populate("favoriteCharacter")
    .then((singleUser) =>{
        // Let's find all the characters that have req.session.user._id as its creator:
        Character.find({creator: req.session.user._id})
        .then((charactersFound) => {
            // console.log(charactersFound); returns an array of characters.
            // todo Capitalize first letter (does not work)
            const {username, favoriteCharacter} = singleUser
            if(favoriteCharacter) {
                favoriteCharacter.name = capitalize(favoriteCharacter.name)
                console.log(favoriteCharacter.name)
            }
            res.render("private/profile", {
                username,
                favoriteCharacter,
                charactersFound
            })
        })
        .catch((err) => {
            next(err)
        })
        
    })
    .catch((err) =>{
        next(err)
    })
    
})

// POST "/private/profile/:characterId" => Search User by its Id and update favoriteCharacter property with the character's id:
router.post("/profile/:characterId", (req, res, next) => {
    // Get the params and the session.user. Search by req.session.user._id and update favoriteCharacter with req.params.characterId:
    // console.log(req.params.characterId, req.session.user._id)
    User.findByIdAndUpdate(req.session.user._id, {
        favoriteCharacter: req.params.characterId
    })
    .then(() =>{
        console.log("Added favorite Character")
        /* req.session.user.favoriteCharacter = req.params.characterId TEST*/
        // If the user is updated, render the profile:
        res.redirect("/private/profile/")

    })
    .catch((error) =>{
        next(error)
    })

})

// export it:
module.exports = router;