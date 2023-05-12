// require and use express:
const express = require('express');
const router = express.Router();

// Require the Character model:
const Character = require("../models/Character.model");

//* create an array for species
let speciesArray = ["human", "droid", "rhodian"];

//*create an array for Homeworlds
let homeworldArray = ["tatooine", "parnassos", "jakku"]


//* GET "/characters" => render list of characters

router.get("/", (req, res, next) => {
  //* find and render all characters
    Character.find()
  .then(characters => {
      res.render("characters/list", { characters });
    })
  .catch(err => {
      console.log(err);
    });
});

//* GET "/characters/new" => render form to create a new character
router.get("/new", (req, res, next) => {
    res.render("characters/new",{
        species: speciesArray,
        homeworld: homeworldArray 
    }); 
})

//* POST "/characters" => create a new character
router.post("/new", (req, res, next) => {
    console.log(req.body)
    const {name, species, homeworld, age, image} = req.body;
    //* create a new character
    Character.create({
        name,
        species,
        homeworld,
        age,
        image 
    })
    .then(()=>{
        console.log("Character created successfully")
    })
    .catch((error)=>{
        next(error)
    })
})



// export the routes:
module.exports = router;