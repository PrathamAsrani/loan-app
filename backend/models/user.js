const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    user_type:{
        type:String,
        default:"user"
    }
});

module.exports = mongoose.model("Users", userSchema);