// Let's create a middleware to protect private routes. It will only execute on private routes.
function isLoggedIn(req, res, next) {
    if (req.session.user === undefined) {
        res.redirect("/auth/login")
    } else {
        next(); // If there is a req.session.user, continue with the route.
    }
}

// Let's create a middleware function that updates the links we can see on the navbar (locals), depending on if the user is logged in or not.
// It creates a variable accessible in Handlebars and will be accessible in all routes.
function updateLocals(req, res, next) {
    // Verify if the user is logged in:
    if (req.session.user === undefined) {
        res.locals.isUserActive = false
    } else {
        res.locals.isUserActive = true
    }
    next() // Continue with the route.
}

// Export our middleware functions:
module.exports = {
    isLoggedIn,
    updateLocals
}