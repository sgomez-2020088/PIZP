import User from '../models/User.js'
import { sendVerificationEmail } from '../utils/sendEmail.js'

export async function twoFactorAuth(req, res, next) {
    const { DPI } = req.body

    let user = await User.findOne({ DPI })
    if (!user) return res.status(404).send({ message: 'User not found', success: false })

    if (!user.verificationCode || new Date() > user.verificationCodeExpiration) {
        const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase()

        await sendVerificationEmail(user.email, verificationCode)

        user.verificationCode = verificationCode
        user.verificationCodeExpiration = new Date(Date.now() + 2 * 60 * 1000)
        await user.save()

        return res.status(400).send({ message: 'Please verify your email', success: false })
    }
    next()
}
