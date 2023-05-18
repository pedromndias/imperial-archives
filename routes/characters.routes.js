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

// Require species array from .json utils
let speciesArray = require("../utils/species.json"); 

// Require homeworld array from .json utils
let homeworldArray = require("../utils/homeworld.json")
 

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

//* POST "/characters/new" => create a new character
// Note the middleware (uploader function) as an argument for the router, using the "image" property.
router.post("/new", uploader.single("image"), async (req, res, next) => {
    // console.log(req.body)
    const {name, species, homeworld, age, image} = req.body;
    // Cloudinary will return the url on the req.file:
    console.log(req.file);
    // Create a handler for the case when the image is not passed:
    /* if(req.file === undefined) {
        next("There is no image")
        return // To stop the the route execution (and avoid app crash)
    } */

    //* Server validation:
    // Check if the name, species, homeworld and image fields are not empty:
    if (name === "" || species === "" || homeworld === "" || image === "" || req.file === undefined) {
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

//* GET "/characters/:charId/edit-image" => show form to update image by char ID
router.get("/:charId/edit-image", isLoggedIn, (req, res, next) =>{
    Character.findById(req.params.charId)
    .then((singleChar)=>{
        res.render("characters/edit-image", {
            singleChar: singleChar
        })
    })
    .catch((err) =>{
        next(err)
    })
})

//* POST "/characters/:charId/edit-image" => update image of char by ID
router.post("/:charId/edit-image", isLoggedIn, uploader.single("image"), (req, res, next) =>{
    // console.log(req.file)
    // console.log(req.body)
    // console.log(req.params.charId)
    
    //* Validations:
    Character.findById(req.params.charId)
    .then((singleChar) => {
        // If no image, redirect to the same page with an error:
        if (req.body.image === "" || req.file === undefined) {
            res.render("characters/edit-image", {
                singleChar: singleChar,
                errorMessage: "Please upload an image"
            })
            return;
        }
        // If all good, we update the character's image:
        Character.findByIdAndUpdate(req.params.charId, {
            image: req.file.path
        })
        .then(() => {
            // console.log("Image updated")
            res.redirect(`/characters/${req.params.charId}/details`)
        })
        .catch((err) => {
            next(err)
        })
    })
    .catch((err) => {
        next(err)
    })
})

//* GET "/characters/:charId/edit-character" => show form to update character details by its ID
router.get("/:charId/edit-character", (req, res, next) => {
    // console.log(req.params)
    // Let's find the character by its id and render:
    Character.findById(req.params.charId)
    .then((singleChar) => {
        res.render("characters/edit-character", {
            singleChar: singleChar,
            species: speciesArray,
            homeworld: homeworldArray
        })
    })
    .catch((err) => {
        next(err)
    })
})

//* POST "/characters/:charId/edit-character" => update character details by its ID
router.post("/:charId/edit-character", (req, res, next) => {
    // Check what returns from the view:
    // console.log(req.body);
    // console.log(req.params.charId)
    // Destructure the req.body:
    const {name, species, homeworld, age} = req.body

    // Get our singleChar object:
    Character.findById(req.params.charId)
    .then((singleChar)=> {
        //* Validations:
        if(name === "" || species === "" || homeworld === "" || age === "") {
            res.render("characters/edit-character", {
                singleChar: singleChar,
                species: speciesArray,
                homeworld: homeworldArray,
                errorMessage: "Name, species, homeworld and age are mandatory"
            })
        }
        // If all the fields are not empty, let's update the character:
        return Character.findByIdAndUpdate(req.params.charId, {
            name,
            species,
            homeworld,
            age
        }, {new: true})
        
    })
    .then((characterUpdated) => {
        // console.log(characterUpdated)
        res.redirect(`/characters/${req.params.charId}/details`);
    })
    .catch((err) => {
        next(err)
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
        // console.log(singleChar)
        // Capitalize first letter of the character's name:
        // singleChar.name = capitalize(singleChar.name) 
        console.log(singleChar);

        // Search all comments for this character:
        Comment.find({character: req.params.charId})
        // Populate our 2 relations:
        .populate("creator")
        .then((allComments) => {
            // Clone array to modify it:
            let clonedAllComments = JSON.parse(JSON.stringify(allComments))
            // Add a special variable isOwnComment so know if the owner of the comment is logged in and then can delete the comment:
            clonedAllComments.forEach((eachComment) => {
                if (eachComment.creator._id === req.session.user._id) {
                    eachComment.isOwnComment = true
                }
                // If the logged in user is admin or moderator, they can delete any comments:
                if (req.session.user.role === "moderator" || req.session.user.role === "admin") {
                    eachComment.canDeleteComment = true;
                }
            })
            
            // console.log("Comments found:", clonedAllComments)
            res.render("characters/char-details",{
                // render the character's object and the array of comments:
                singleChar: singleChar,
                allComments: clonedAllComments,
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

// POST "/characters/:charId/details" => Get info from comment text area and render the page with new comment:
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

// POST "characters/:commentId" => Get info from comment id, delete it and render character's page without it:
router.post("/:commentId", (req, res, next) => {
    // console.log(req.params.commentId)
    // todo don't nest then-catch
    Comment.findByIdAndDelete(req.params.commentId)
    .then((singleComment) => {
        console.log(singleComment.character)
        res.redirect(`/characters/${singleComment.character}/details`)
    })
    .catch((err) => {
        next(err)
    })
})

// POST "characters/:charId/delete" => Delete specific user by its Id:
router.post("/:charId/delete", (req, res, next) => {
    // console.log(req.params);
    // Let's find the character by its Id and delete it:
    Character.findByIdAndDelete(req.params.charId)
    .then(() => {
        // console.log("User deleted!")
        res.redirect("/characters")
    })
    .catch((err) => {
        next(err)
    })
})

// export the routes:
module.exports = router;