const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const signup = async (req, res) => {
    //At first destructuring data
    const { firstName, lastName, email, password, phoneNum } = req.body;
    console.log(req.body)
    if (!firstName || !lastName || !email || !password || !phoneNum) {
        res.status(400).json({
            success: false,
            message: "Please enter all fields"
        })
    }
    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = await User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            phoneNum: phoneNum
        })
        await userData.save()
        res.status(201).json({
            success: true,
            userData,
            message: "User Created Successfully"
        })
    } catch (error) {
        console.log(`Error of signnup ${error}`)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        })
    }
    try {
        const userData = await User.findOne({ email: email })
        if (!userData) {
            return res.status(400).json({
                success: false,
                message: "User Donot exist"
            }
            )
        }
        const checkPasswrd = await userData.password
        const isMatched = await bcrypt.compare(password, checkPasswrd)
        if (!isMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            }
            )
        }
        const payload = {
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            password: userData.password
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "6hr" });
        res.status(201).json({
            success: true,
            token,
            userData,
            message: "Login Successfully"
        })
    } catch (error) {
        console.log(`Error of signin is ${error}`)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        console.log(user)
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }
        return res.status(200).json({
            success: true,
            user,
            message: "User Profile fetched Successfully"
        })
    } catch (error) {
        console.log(`Error of getProfile is ${error}`)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    signup, signin, getProfile
}