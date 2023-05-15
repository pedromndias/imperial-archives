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
        // If the user is logged in than we change the local variables:
        res.locals.isUserActive = true;
        if(req.session.user.role === "moderator") {
            res.locals.isModerator = true;
        } else if (req.session.user.role === "admin"){
            res.locals.isAdmin = true;
        }
    }
    next() // Continue with the route.
}

function isModerator(req, res, next){
    if(req.session.user.role === "moderator"){
        next()
    } else {
        res.redirect("/characters", 
        // {
        //     errorMessage: "You do not have permission to create a new character."
        // }
        )
    }
}

function isAdmin(req, res, next){
    if(req.session.user.role === "admin") {
        next();
    } else {
        res.redirect("/main")
    }
}

// Export our middleware functions:
module.exports = {
    isLoggedIn,
    updateLocals,
    isModerator,
    isAdmin
}