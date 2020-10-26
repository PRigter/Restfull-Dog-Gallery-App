const  mongoose = require("mongoose")
const bcrypt = require("bcrypt")


// User Schema - Email, username & passport
const UserSchema = new mongoose.Schema({
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


const User = mongoose.model("User", UserSchema)


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