const JWT = require('jsonwebtoken')
const userModel = require('../models/user.js')

module.exports.requireSignIn = async(req, res, next) => {
    try{
        let token = req.headers.authorization;
        const decode = await JWT.verify(token, process.env.JWT_SECRET)
        req.user = decode;
        next()
    }
    catch(err){
        console.log(`Error in requireSignIn middleware ${err}`)
        res.status(500).send({
            success: false,
            message: `Error in requireSignIn middleware ${err}`
        })
    }
}

module.exports.isAdmin = async(req, res, next) => {
    try{
        const user = await userModel.findById(req.user._id);
        if(user.user_type === "admin"){
            next()
        }else{
            return res.status(401).send({
                success: false,
                message: "Unauthorized access"
            })
        }
    }catch(err){
        console.log(`Error in isAdmin of middlewares: ${err}`);
        res.status(401).send({
            status: false,
            error: `Error in isAdmin of middlewares: ${err}`
        })
    }
}