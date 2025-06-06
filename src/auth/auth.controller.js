import {encrypt, checkPassword} from "../../utils/encrypt.js"
import { generateJwt } from "../../utils/jwt.js"

import User from "../user/user.model.js"

export const register = async(req,res) =>{
    try {
        let data = req.body

        let user = new User(data)
        user.role = 'USER'
        user.status = true
        user.password = await encrypt(user.password)
        
        await user.save()
        return res.send({success:true, message:'User successfully registered'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success:false, message:'General Error',err})
    }
}

export const login = async(req,res) =>{
    try {
        let{DPI, password} = req.body
        let user = await User.findOne(
            {
                DPI
            }
        )
        if(!user) return res.status(404).send({success: false, message:'User not found'})
        if(user.status === false) return res.status(404).send({success: false, message:'User not found'})
        if(user && await checkPassword(user.password, password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                role: user.role,
                status: user.status
            }
            let token = await generateJwt(loggedUser)
            return res.send({success: true, message:`Welcome ${user.name}`,loggedUser, token})
        }
        return res.status(404).send({success: false, message:'Wrong information'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success:false, message: 'General Error',err})
    }
}