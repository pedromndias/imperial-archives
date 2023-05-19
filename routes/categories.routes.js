// require and use express:
const express = require("express");
const router = express.Router();

// Require the Character model:
const Character = require("../models/Character.model");

// require and destructure the middleware to use the isLoggedIn funciont.
const { isLoggedIn } = require("../middlewares/auth.middlewares");

// GET "/categories/" => Render a list of all categories:
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("categories/list");
});

// Use dynamic routes to render different list of categories's list.
// GET "/categories/species" => Render a list of all species.
// Note how these next routes will only be accessible if the user is logged in (isLoggedIn middleware).
router.get("/species", isLoggedIn, (req, res, next) => {
  // distinct works doing ...
  Character.distinct("species")
    .then((speciesList) => {
      //console.log(speciesList)
      res.render("categories/species", {
        speciesList: speciesList,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET "/categories/homeworlds" => Render a list of all homeworlds.
router.get("/homeworlds", isLoggedIn, (req, res, next) => {
  Character.distinct("homeworld")
    .then((homeworldsList) => {
      // console.log(homeworldsList);
      res.render("categories/homeworlds", {
        homeworldsList: homeworldsList,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET "/categories/:species/list" => render list of characters by specific species:
router.get("/:species/list", (req, res, next) => {
  Character.find({ species: req.params.species })
    .then((allCharBySpecies) => {
      // console.log(allCharBySpecies);
      res.render("categories/species-list", {
        allCharBySpecies: allCharBySpecies,
        oneSpecies: req.params.species,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET "/categories/:homeworlds/list" => render list of characters by specific homeworld:
router.get("/:homeworld/homeworlds-list", (req, res, next) => {
  Character.find({ homeworld: req.params.homeworld })
    .then((allCharByHomeworld) => {
      // console.log(allCharByHomeworld);
      res.render("categories/homeworlds-list", {
        allCharByHomeworld: allCharByHomeworld,
        oneHomeworld: req.params.homeworld,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// export the routes:
module.exports = router;
