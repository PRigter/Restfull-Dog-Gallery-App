const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const expressSanitizer = require("express-sanitizer")
const methodOverride = require("method-override")
const Dog = require("./models/dog")
const User = require("./models/user")
const bcrypt = require("bcrypt")
const auth = require("./middleware/auth")
const session = require("express-session")

// Call for DB Connection
require("./db/mongoose")

const app = express()

// ENVIROMENT VARIABLES
const PORT = process.env.PORT
const USERNAME = process.env.USERNAME
const SESSION_SECRET = process.env.SESSION_SECRET

// PATH FOR EXPRESS CONFIG
const publicDirectoryPath = path.join(__dirname, "../public")

// APP CONFIG
app.set("view engine", "ejs")
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer()) // Must be below bodyParser
app.use(methodOverride("_method"))
app.use(session({       // To assign/validate session after user LOG's IN
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))


// RESTfull ROUTES
app.get("/", function(req, res) {
    res.redirect("/dogs")
})


// INDEX ROUTE
app.get("/dogs", function(req, res) {
    
    // Get all Dogs from DB, and Pass them to Page
    Dog.find({}, function(err, dogs) {
        if (err) {
            console.log(err)
        } else {
            res.render("index", {dogs: dogs})
        }
    })
})


// NEW ROUTE 
    //* Note: Must be above SHOW ROUTE
app.get("/dogs/new", function(req, res) {
    
    // Restricted Route - Verify first id Session is still valid
    if (!req.session.user_id) {
        return res.redirect("/dogs/login")
    }
    
    res.render("new")
})


// CREATE ROUTE
app.post("/dogs", function(req, res){

    // Sanitize Input text-area -- shoud be created as Middleware
    req.body.dog.about = req.sanitize(req.body.dog.about)

    Dog.create(req.body.dog, function(err, newDog) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/dogs")
        }
    })
})


// LOGIN ROUTE
app.get("/dogs/login", function(req, res) {
    res.render("login")
})


// Handle Login - Authentication
app.post("/dogs/login", async function(req, res) {
    const password = req.body.password
    // Finds User on DB (using our enviroment variable for testing)
    const user = await User.findOne({ username: USERNAME })
    
    // Password validation - Using Bcrypt
    const validPass =  await bcrypt.compare(password, user.password)

    if (validPass) {
        // Adding Session to validate that user is still logged in on this session - Using npm -> express-session
        req.session.user_id = user._id
        res.redirect("/dogs")
    } else {
        res.redirect("/dogs/login")
    }

})




//SHOW ROUTE
app.get("/dogs/:id", function(req, res) {
    // Get req params id
    const dogId = req.params.id
    console.log(dogId)
    
    // Find Specific ID in DB, and Send it to Page
    Dog.findById(dogId, function(err, foundDog) {
        if (err) {
            console.log(err)
        } else {
            res.render("show", {dog: foundDog})
        }
    })
})


// EDIT ROUTE
app.get("/dogs/:id/edit", function(req, res) {
    
    // Restricted Route - Verify first id Session is still valid
    if (!req.session.user_id) {
        return res.redirect("/dogs/login")
    }

    Dog.findById(req.params.id, function(err, foundDog) {
        if (err) {
            console.log(err)
        } else {
            res.render("edit", {dog: foundDog})
        }
    })
    
})


// UPDATE ROUTE
app.put("/dogs/:id", function(req, res) {

    if (!req.session.user_id) {
        return res.redirect("/dogs/login")
    }
    
    req.body.dog.about = req.sanitize(req.body.dog.about)
    const dogId = req.params.id

    Dog.findByIdAndUpdate(dogId, req.body.dog, function(err, foundDog) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/dogs/" + req.params.id)
        }
    })
})


// DELETE ROUTE
app.delete("/dogs/:id", function(req, res) {

    if (!req.session.user_id) {
        return res.redirect("/dogs/login")
    }

    const dogId = req.params.id
    
    Dog.findByIdAndRemove(dogId, function(err, data) {
        if (err) {
            res.redirect("/dogs")
        } else {
            console.log("================")
            console.log(data + " deleted")
            res.redirect("/dogs")
        }
    })
})






app.listen(PORT || 3000, function(req, res) {
    console.log("Server Up and Running, on Port: " + PORT)
})

