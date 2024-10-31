const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(
            `Connected To MongoDB Database ${conn.connection.host}`
        );
    } catch(err){
        console.error('Could not connect to MongoDB...', error);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB