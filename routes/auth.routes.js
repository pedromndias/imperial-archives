// require and use express:
const express = require('express');
const router = express.Router();

// Require the User model:
const User = require("../models/User.model");

// require bcryptjs for the authetication process:
const bcrypt = require("bcryptjs");

// GET "/auth/register" => Render the register form:
router.get("/register", (req, res, next) => {
    res.render("auth/register")
})

// POST "/auth/register" => Get the data from register form:
router.post("/register", async (req, res, next) => {
    // console.log(req.body);
    // Destructure req.body:
    const {username, email, password} = req.body;

    //* Server validation:
    // Check if the username, email and password fields are not empty:
    if (username === "" || email === "" || password === "") {
        // console.log("Username, email or password are empty");
        // If any field is empty, render the same page but with an error:
        res.render("auth/register.hbs", {
            errorMessage: "The username, email and password are mandatory"
        })
        // We also need to stop the route:
        return;
    }
    // Password validation with Regular Expressions:
    const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
    if (regexPattern.test(password) === false) {
        res.render("auth/register.hbs", {
            errorMessage: "Your password is not strong enough. You need at least 8 characters, 1 capital letter, 1 lowercase letter, 1 special character and 1 numeric character."
        })
        return;
    }
    // Async validations:
    try {
        // Check if username is already used:
        const foundUsername = await User.findOne({username: username});
        if(foundUsername !== null) {
            res.render("auth/register.hbs", {
                errorMessage: "Username alredy in use."
            })
            return;
        }
        // Check if email is already used:
        const foundEmail = await User.findOne({email: email});
        if(foundEmail !== null) {
            res.render("auth/register.hbs", {
                errorMessage: "Email alredy in use."
            })
            return;
        }
        
        // Let's encrypt the password with bcrypt and salt:
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);
        // console.log(hashPassword);
        
        // After all validations, we can create our user in the DB:
        await User.create({
            username: username,
            email: email,
            password: hashPassword
        })
        // And redirect to the login page:
        res.redirect("/auth/login");

    } catch (error) {
        next(error)
    }
})

// GET "/auth/login" => Render login form:
router.get("/login", (req, res, next) => {
    res.render("auth/login")
})

// POST "/auth/login" => Get data from login form:
router.post("/login", async (req, res, next) => {
    // console.log(req.body)
    const {email, password} = req.body;

    // Check if all fields are not empty:
    if (email === "" || password === "") {
        res.render("auth/login.hbs", {
            email,
            errorMessage: "Email and password are mandatory to login."
        })
        return;
    }

    try {
        // Check if the user exists in DB:
        const foundUser = await User.findOne({email: email});
        if(foundUser === null) {
            res.render("auth/login.hbs", {
                // Send email to preview it in input field:
                email,
                errorMessage: "User does not exist."
            })
            return;
        }

        // Check that the password is correct:
        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
        // console.log(isPasswordCorrect);
        if (isPasswordCorrect === false) {
            res.render("auth/login.hbs", {
                email,
                errorMessage: "Password is not correct."                
            })
            return;
        }

        // After the user has authentication passed, let's create the session:
        req.session.user = foundUser;

        // If the session is correctly saved, we can redirect the user to a private page:
        req.session.save(() => {
            res.redirect("/private/main")
        })
 
    } catch (error) {
        next(error)
    }
})

// GET "auth/logout" => Close (destroy) the active session:
router.get("/logout", (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/");
    })
})

// export the routes:
module.exports = router;