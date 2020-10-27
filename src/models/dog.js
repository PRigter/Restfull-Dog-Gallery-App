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



module.exports = Dog