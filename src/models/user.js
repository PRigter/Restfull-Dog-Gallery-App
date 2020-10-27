const  mongoose = require("mongoose")
const bcrypt = require("bcrypt")

// Enviroment Variable
const USERNAME = process.env.USERNAME

// User Schema - Email, username & passport
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    }    
})



// Refactoring to Model Methods --> A method to serve LOGIN ROUTE
    // 1- Find the user on DB
    // 2 - Compare the password with then hash version on DB

userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username: USERNAME })
    const isValid = await bcrypt.compare(password, foundUser.password) 
    // In case of TRUE --> Returning the Data from the user 
        // We may need it, per example to add a session id
    // in case of Not Valid, return false
    return isValid ? foundUser : false
}



userSchema.pre("save", async function(next) {
    this.password = await bcrypt.hash(this.password, 12)
    next()
})





const User = mongoose.model("User", userSchema)

module.exports = User

// App User
// User.create({
//     username: process.env.USERNAME,
//     password: process.env.PASSWORD
// }, function(err, user) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("User created and saved")
//     }
// })
