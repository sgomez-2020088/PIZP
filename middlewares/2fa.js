import User from '../models/User.js'
import { sendVerificationEmail } from '../utils/sendEmail.js'

export async function twoFactorAuth(req, res,next){
    const { DPI } = req.body

    let user = await User.findOne({ DPI })
    if(!user) return res.status(404).send({message: 'User not found', success: false})

    if(!user.verificationCode){
        const verificationCode = await sendVerificationEmail(user.email)

        user.verificationCode = verificationCode 
        user.verificationCodeExpiration = new Date(Date.now() + 15 * 60 * 1000)
        await user.save()

        return res.status(400).send({message:'Please verify you email', success: false})
    }

    if(new Date() > user.verificationCodeExpiration){
        return res.status(400).send({message: 'Verification code expired, please request a new one', success: false})
    }

    next()
}