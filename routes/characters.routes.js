// require and use express:
const express = require('express');
const router = express.Router();

// Require the Character model:
const Character = require("../models/Character.model");
// Require the User Model:
const User = require("../models/User.model");
// Require the Comment Model:
const Comment = require("../models/Comment.model");

// require the uploader middleware (for the Cloudinary features)
const uploader = require("../middlewares/uploader")

// Require capitalize function:
const capitalize = require("../utils/capitalize")

//* create an array for species
let speciesArray = ["human", "droid", "rhodian"];

//*create an array for Homeworlds
let homeworldArray = ["tatooine", "parnassos", "jakku"];

// require and destructure the middleware:
const {isLoggedIn, isModerator} = require("../middlewares/auth.middlewares")

//* GET "/characters" => render list of characters
router.get("/", isLoggedIn, (req, res, next) => {
  //* find and render all characters
    Character.find()
  .then(characters => {
    // console.log(characters);
    // Clone the returned array because MongoDB returns a special array.
    const cloneArr = JSON.parse(JSON.stringify(characters))
        // Capitalize first letter of the Character's name:
        const capCharacters = cloneArr.map(eachChar => {

            return {
                ...eachChar,
                name: capitalize(eachChar.name)
            }
        })
        
        // console.log(capCharacters);
      res.render("characters/list", { capCharacters});
    })
  .catch(err => {
      console.log(err);
    });
});

//* GET "/characters/new" => render form to create a new character
router.get("/new", isLoggedIn, isModerator, (req, res, next) => {
    res.render("characters/new",{
        species: speciesArray,
        homeworld: homeworldArray
    });
})

//* POST "/characters" => create a new character
// Note the middleware (uploader function) as an argument for the router, using the "image" property.
router.post("/new", uploader.single("image"), async (req, res, next) => {
    // console.log(req.body)
    const {name, species, homeworld, age, image} = req.body;
    // Cloudinary will return the url on the req.file:
    console.log(req.file);
    // Create a handler for the case when the image is not passed:
    if(req.file === undefined) {
        next("There is no image")
        return // To stop the the route execution (and avoid app crash)
    }

    //* Server validation:
    // Check if the name, species, homeworld and image fields are not empty:
    if (name === "" || species === "" || homeworld === "" || image === "") {
        // console.log("Name, species, homeworld and image are empty");
        // If any field is empty, render the same page but with an error:
        // todo Add values to fields already completed. (Watch class from wednesday, forEach on edit route from book app)
        res.render("characters/new", {
            name,
            species: speciesArray,
            homeworld: homeworldArray,
            errorMessage: "The name, species, homeworld and image fields are required"
        })
        // We also need to stop the route:
        return;
    }

    // Asynchronous validations:
    try {
        let lowercaseName = name.toLowerCase();
        // Check if the character's name already exists:
        const foundChar = await Character.findOne({name: lowercaseName})
        if (foundChar !== null) {
            res.render("characters/new", {
                name,
                species: speciesArray,
                homeworld: homeworldArray,
                errorMessage: "This Character already exists"
            })
            return;
        }
        
        // How to access local images uploaded. Cloudinary

    } catch (error) {
        next(error)
    }

    //* create a new character
    Character.create({
        name,
        species,
        homeworld,
        age,
        // For the image we will add the path of what cloudinary returns:
        image: req.file.path,
        creator: req.session.user._id
    })
    .then(()=>{
        // console.log("Character created successfully");
        // todo Show success message: study HBS DOCS
        // res.render("characters/new.hbs", {
        //     successMessage: "New character created!"  
        // })
        
        // If successfully created, we will redirect to the list of characters:
        res.redirect("/characters")

    })
    .catch((error)=>{
        next(error)
    })
})

// GET "/characters/:charId/details" => Render specific character by ID:
router.get("/:charId/details", isLoggedIn, (req, res, next) => {
    /* console.log(req.params); */
    // Find the character that matches the id sent by the params:
    Character.findById(req.params.charId)
    // Populate with the creator (User model relation)
    .populate("creator")
    .then((singleChar) => {
        // Capitalize first letter of the character's name:
        singleChar.name = capitalize(singleChar.name) 
        // console.log(singleChar);

        // Search all comments for this character:
        Comment.find({character: req.params.charId})
        // Populate our 2 relations:
        .populate("creator")
        .then((allComments) => {
            // console.log("Comments found:", allComments)
            res.render("characters/char-details",{
                // render the character's object and the array of comments:
                singleChar: singleChar,
                allComments: allComments
              })
        })
        .catch((err) => {
            next(err)
        })

        
    })
    .catch((err) => {
        next(err)
    })
})

// POST => Get info from comment text area and render the page with new comment:
router.post("/:charId/details", (req, res, next) => {
    // console.log(req.params.charId)
    // console.log(req.body.comment);
    // Create new comment with req.session.user._id as creator, req.body.comment as content and req.params.charId as character:
    Comment.create({
        creator: req.session.user._id,
        content: req.body.comment,
        character: req.params.charId
    })
    .then(() => {
        //console.log("Comment created.")
        res.redirect(`/characters/${req.params.charId}/details`)
    })
    .catch((err) => {
        next(err)
    })
})

// export the routes:
module.exports = router;