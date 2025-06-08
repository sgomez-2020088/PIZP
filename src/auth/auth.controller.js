import {encrypt, checkPassword} from "../../utils/encrypt.js"
import { generateJwt } from "../../utils/jwt.js"
import { sendVerificationEmail } from "../../utils/sendEmail.js"
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
/*
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
}*/

export const login = async (req, res) => {
    try {
        const { DPI, password } = req.body;
        let user = await User.findOne({ DPI });

        if (!user) return res.status(404).send({ success: false, message: 'User not found' });
        if (user.status === false) return res.status(404).send({ success: false, message: 'User not found' });

        // Verificación de código
        if (!user.verificationCode) {
            const verificationCode = await sendVerificationEmail(user.email);
            user.verificationCode = verificationCode;
            user.verificationCodeExpiration = new Date(Date.now() + 15 * 60 * 1000); 
            await user.save();
            return res.status(400).send({ success: false, message: 'Please verify your email to log in.' });
        }

        if (new Date() > user.verificationCodeExpiration) {
            return res.status(400).send({ success: false, message: 'Verification code expired. Please request a new one.' });
        }

        if (user && await checkPassword(user.password, password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                role: user.role,
                status: user.status
            };
            let token = await generateJwt(loggedUser);
            return res.send({ success: true, message: `Welcome ${user.name}`, loggedUser, token });
        }

        return res.status(404).send({ success: false, message: 'Wrong information' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General Error', err });
    }
}

export const verifyCode = async (req, res) =>{
    const { DPI, verificationCode} = req.body
    
    let user = await User.findOne({ DPI})

    if(!user) return res.status(404).send({message: 'User not found', success: false})

    if(user.verificationCode === verificationCode){
        user.status = true
        user.verificationCode = null
        await user.save()
        return res.send({message: 'User successfully verified', success: true})
    } else {
        return res.status(400).send({message: 'Invalid verification code', success: false})
    }
}