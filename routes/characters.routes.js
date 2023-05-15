// require and use express:
const express = require('express');
const router = express.Router();

// Require the Character model:
const Character = require("../models/Character.model");

// Require the User Model:
const User = require("../models/User.model");

// Require capitalize function:
const capitalize = require("../utils/capitalize")

//* create an array for species
let speciesArray = ["human", "droid", "rhodian"];

//*create an array for Homeworlds
let homeworldArray = ["tatooine", "parnassos", "jakku"];

// require and destructure the middleware:
const {isLoggedIn} = require("../middlewares/auth.middlewares")

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
        
        console.log(capCharacters);
      res.render("characters/list", { capCharacters});
    })
  .catch(err => {
      console.log(err);
    });
});

//* GET "/characters/new" => render form to create a new character
router.get("/new", isLoggedIn, (req, res, next) => {
    res.render("characters/new",{
        species: speciesArray,
        homeworld: homeworldArray 
    }); 
})

//* POST "/characters" => create a new character
router.post("/new", async (req, res, next) => {
    console.log(req.body)
    const {name, species, homeworld, age, image} = req.body;

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
        image,
        creator: req.session.user._id
    })
    .then(()=>{
        // console.log("Character created successfully");
        // Show success message: HBS DOCS
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
    Character.findById(req.params.charId)
    .populate("creator")
    .then((singleChar) => {
        singleChar.name = capitalize(singleChar.name) 
        console.log(singleChar); 
        res.render("characters/char-details",{
          singleChar: singleChar,  
        })
        // Create new char object with capitalized name:
        //capName = capitalize(singleChar.name)
        // console.log("Character found!");
        // console.log(capName);
        
        /* console.log(singleChar); */
        /* User.findById(singleChar.creator)
        .then((singleUser)=>{
            console.log(singleUser);
            res.render("characters/char-details", {
                name: capName,
                species: singleChar.species,
                homeworld: singleChar.species,
                age: singleChar.age,
                image: singleChar.image,
                creatorName: singleUser.username,
                charId: singleChar._id 
            }) */
        
       /*  })
        .catch((error) => {
            next(error)
        }) */
    })
    .catch((err) => {
        next(err)
    })
    
})

// export the routes:
module.exports = router;