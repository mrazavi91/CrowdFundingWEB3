import User from "../models/User.js"
import bcrypt from 'bcrypt'

export const getAllUsers = async (req, res, next) => {

    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        res.json(error.message)
    }
    
}


export const userSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const existing = await User.findOne({ email })
        if (existing) return res.status(401).json({ message: "User already registered" })
        
        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = new User({ name, email, password: hashedPassword }) 
        await user.save()
        res.status(201).json({ message :'User Created Successfully!' , id: user._id.toString()})
    } catch (error) {
        res.json({error: error.message})
    }
}


export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ message: " User not registered" })
        
        const validPassword =  bcrypt.compareSync(password, user.password)
        if(!validPassword) return res.status(403).json({ message: "Invalid Password" })
        
        res.status(200).json({ message :'User Created Successfully!' , id: user._id.toString()})
    } catch (error) {
        res.json({error: error.message})
    }
}