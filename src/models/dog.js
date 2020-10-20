const mongoose = require("mongoose")

// DB Schema
const dogSchema = new mongoose.Schema({
    breed: String,
    image: String,
    credits: String,
    about: String,
    created: {type: Date, default: Date.now}
})

const Dog = mongoose.model("Dog", dogSchema)


//* MANUAL DATA - TESTING
// Dog.create({
//     breed: "Akita",
//     image: 
//     about: "Very sweet and nice dog."
// })

// Dog.create({
//     name: "Yoshi",
//     breed: "Akita",
//     color: "Caramel",
//     age: 9,
//     about: "Big and kind dog."
// })







module.exports = Dog