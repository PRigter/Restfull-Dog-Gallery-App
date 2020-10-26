const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const expressSanitizer = require("express-sanitizer")
const methodOverride = require("method-override")
const Dog = require("./models/dog")
const User = require("./models/user")
const auth = require("./middleware/auth")

// Call for DB Connection
require("./db/mongoose")

const app = express()

// ENVIROMENT VARIABLES
const PORT = process.env.PORT




// PATH FOR EXPRESS CONFIG
const publicDirectoryPath = path.join(__dirname, "../public")

// APP CONFIG
app.set("view engine", "ejs")
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer()) // Must be below bodyParser
app.use(methodOverride("_method")) 


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
    res.render("new")
})


// CREATE ROUTE
app.post("/dogs", auth, function(req, res){

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

app.post("/dogs/login", function(req, res) {
    res.sendStatus(300)
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

