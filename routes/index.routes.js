const express = require('express');
const router = express.Router();

// Let's import and destructure the middlewares:
const {updateLocals} = require("../middlewares/auth.middlewares")
// And use updateLocals to show specific links on the navbar and show different elements on the pages:
router.use(updateLocals);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
  // console.log(req.session);
});

// require our auth routes files:
const authRouter = require("./auth.routes")
// and use them:
router.use("/auth", authRouter)

// require our characters routes files:
const charactersRouter = require("./characters.routes")
// and use them:
router.use("/characters", charactersRouter)

// require our private routes files:
const privateRouter = require("./private.routes")
// and use them:
router.use("/private", privateRouter)

// require our categories routes files:
const categoriesRouter = require("./categories.routes")
// and use them:
router.use("/categories", categoriesRouter)

// require our admin routes files:
const adminRouter = require("./admin.routes")
// and use them:
router.use("/admin", adminRouter)

module.exports = router;
