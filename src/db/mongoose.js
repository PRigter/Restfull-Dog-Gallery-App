const mongoose = require("mongoose")

// ENVIROMENT VARIABLE
const mongodbUrl = process.env.MONGODB_URL

// DB Connection
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (error, client) => {
    if (error) {
        console.log("Unable to connect do DB", error)
    }

    console.log("Connection to DB is a success!")
})