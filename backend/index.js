// import required libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


// import self made required functions
const connectDB = require("./database/db.js")
const authRouter = require('./routes/authRouter.js')
const loanRouter = require('./routes/loanRouter.js')

// creating server, and config the env
const app = express();
dotenv.config()
// allow resource sharing
app.use(cors())
// allow parsing json data
app.use(express.json())

// connect to DB
connectDB()

// routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/loans", loanRouter)

app.get('/', (req, res) => {
    res.status(200).send({
        message: "Hello world!"
    })
})

app.listen(process.env.PORT, () => {
    console.log(`App is listening to port ${process.env.PORT}`);
})