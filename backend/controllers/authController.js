const userModel = require('../models/user.js')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const hashPassword = async (passwrod) => {
    try {
        const hashedPassword = await bcrypt.hash(passwrod, 10);
        return hashedPassword;
    }
    catch (err) {
        console.log(`Error in hashing password: ${err}`);
    };
}

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

module.exports.registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.send({ error: "name, email and password is required" });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please login",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await new userModel({
            name,
            email,
            password: hashedPassword
        }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
        });
        console.log(`User resgistered successfully, ${user}`);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registeration",
            error,
        });
    }
}

module.exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) return res.status(404).send({ error: `Email is required` });
        if (!password) return res.status(404).send({ error: `Password is required` });
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: `User id not registered` });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: `Invalid Password`
            });
        }
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).send({
            success: true,
            message: `Logged In successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        })
    } catch (error) {
        console.log(`Error in loginController: ${error}`);
        res.status(500).send({
            status: false,
            message: `Error in loginController: ${error}`
        })
    }
}