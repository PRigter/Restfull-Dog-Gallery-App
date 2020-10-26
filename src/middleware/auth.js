const session = require("express-session")

const sessionValidation = (req, res, next) => {
    // Using req.session to validate if login was made and session is still valid
    // If there is no req.session.user_id --> redirect to login page
    if (!req.session.user_id) {
        return res.redirect("/dogs/login")        
    }

    // Otherwise, proceed with the protected route --> next()
    next()

}


module.exports = sessionValidation