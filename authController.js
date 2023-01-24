const User = require('./Models/User')
const Role = require('./Models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id, roles
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController{
    async registration(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: "Validations error"})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate){
                return res.status(400).json("User already exists")
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value:'admin'})
            const user = new User({username, password: hashPassword, roles: [userRole.value,]})
            await user.save()
            return res.json("User was successfully created")
        }
        catch (e){
            console.log(e)
            res.status(400).json("Registration error")
        }
    }
    async roles(req, res){
        try{
            const userRole = new Role({value: 'user'})
            const adminRole = new Role({value: 'admin'})
            await userRole.save()
            await adminRole.save()
            return res.json("Roles successfully created")
        }
        catch (e){
            res.status(500).json(e)
        }
    }
    async login(req, res){
        try{
            const {username, password} = req.body
            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json({message: `User ${username} does not exist`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword){
                return res.status(400).json({message: `Password is incorrect`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token: token})
        }
        catch (e){
            res.status(400).json("Login error")
        }
    }
    async getUsers(req, res){
        try{
            const users = await User.find()
            res.json(users)
        }
        catch (e){
        res.status(400).json(e)
        }
    }
}

module.exports = new authController()