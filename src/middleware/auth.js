

function auth(req, res, next) {

    res.redirect("/dogs/login")    
    const userPass = req.body.password
    // const userPass = "CarameloVerde@2020*!"
    // const userPass = 2
    console.log("Middleware being used")
    console.log(userPass)
    console.log(typeof userPass)
    console.log(process.env.APP_AUTH)
    console.log(typeof process.env.APP_AUTH)

    if (userPass !== process.env.APP_AUTH) {
        res.status(403).redirect("/dogs")
        
    } else if (userPass === process.env.APP_AUTH)  {
        next()
    }


}


module.exports = auth