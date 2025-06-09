import { encrypt } from "../../utils/encrypt.js"; 
import { sendVerificationEmail } from "../../utils/sendEmail.js";
import User from "../user/user.model.js"

export const preRegister = async (req, res) => {
    try {
        const { name, phone, DPI, email, password, surname } = req.body

        let existingUser = await User.findOne({ DPI })

        if (existingUser) return res.status(400).send({ success: false, message: 'DPI already registered' });

        const verificationCode = await sendVerificationEmail(email)

        let user = new User({
            name,
            surname,
            phone,
            DPI,
            email,
            password: await encrypt(password),
            role: 'USER',
            status: false,
            verificationCode,
            verificationCodeExpiration: new Date(Date.now() + 15 * 60 * 1000)
        })

        await user.save();

        return res.status(200).send({
            success: true,
            message: 'Verification code sent to your email',
            DPI: user.DPI,
        })

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'Error during user registration',
            err
        })
    }
}

export const verifyRegisterCode = async (req, res) => {
    try {
        const { DPI, verificationCode } = req.body

        const user = await User.findOne({ DPI })
        if (!user) return res.status(404).send({ success: false, message: 'User not found' })

        if (user.verificationCode !== verificationCode) {
            return res.status(400).send({ success: false, message: 'Invalid verification code' })
        }

        if (new Date() > user.verificationCodeExpiration) {
            return res.status(400).send({ success: false, message: 'Verification code expired' })
        }


        user.status = true
        user.verificationCode = null
        user.verificationCodeExpiration = null
        await user.save()

        return res.send({ success: true, message: 'Account activated successfully' })

    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'Error verifying code', error: err.message });
    }
}

