// require and use express:
const express = require('express');
const router = express.Router();

// require our User model:
const User = require("../models/User.model")
// require our Comment model:
const Comment = require("../models/Comment.model")

// require and destructure the middleware to use the isAdmin function:
const {isAdmin} = require("../middlewares/auth.middlewares")

// GET "/admin/users-list" => Render a list of all users:
// Note how this routes will only be accessible if logged in as admin (isAdmin middleware):
router.get("/users-list", isAdmin, (req, res, next) => {
    // Get all users:
    User.find()
    .then((allUsers) => {
        // console.log(allUsers);
        res.render("admin/all-users", {
            allUsers: allUsers
        })
    })
    .catch((err) => {
        next(err)
    })
})

// POST "/admin/:userId/delete-user" => Delete a specific user by its Id:
router.post("/:userId/delete-user", isAdmin, (req, res, next) => {
    // First let's find the user's comments and delete them:
    Comment.deleteMany({creator: req.params.userId})
    .then((commentDeleteResult) => {
        // Let's console.log to see the result of the deletion. Should be { acknowledged: true, deletedCount: <number of comments deleted> }
        // console.log(singleComment)
        // Then let's find the user by its id and delete it:
        return User.findByIdAndDelete(req.params.userId)
    })
    .then((userDeleted) => {
        // console.log("User deleted: ", userDeleted)
        res.redirect("/admin/users-list")
    })
    .catch((err) => {
        next(err)
    })
})


// Export:
module.exports = router;