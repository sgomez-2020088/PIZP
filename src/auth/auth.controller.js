import { encrypt, checkPassword } from "../../utils/encrypt.js"
import { generateJwt } from "../../utils/jwt.js"
import { sendVerificationEmail } from "../../utils/sendEmail.js"
import User from "../user/user.model.js"

/*
export const register = async (req, res) => {
    try {
        const data = req.body

        const existingUser = await User.findOne({ DPI: data.DPI })
        if (existingUser) return res.status(400).send({ success: false, message: "User already exists" })

        const encryptedPassword = await encrypt(data.password)

    
        const code = Math.random().toString(36).substring(2, 8).toUpperCase()
        const verificationCodeExpiration = new Date(Date.now() + 2 * 60 * 1000)

    
        await sendVerificationEmail(data.email, code)
        console.log("codigo mostrado", code)

        const user = new User({
            ...data,
            password: encryptedPassword,
            role: 'USER',
            status: false, 
            verificationCode: code,
            verificationCodeExpiration
        })

        await user.save()

        return res.send({ success: true, message: 'Verification code sent to your email' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'General Error', err })
    }
}*/

export const register = async (req, res) => {
    try {
        const data = req.body

        const existingUser = await User.findOne({ DPI: data.DPI })
        if (existingUser) return res.status(400).send({ success: false, message: "User already exists" })

        const encryptedPassword = await encrypt(data.password)

        let verificationCode
        const verificationCodeExpiration = new Date(Date.now() + 2 * 60 * 1000)

        const user = await User.findOne({ email: data.email })

        if (!user || new Date() > user.verificationCodeExpiration) {
            verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase()

            await sendVerificationEmail(data.email, verificationCode)
            console.log("📤 Nuevo código generado y enviado:", verificationCode)
        } else {
            verificationCode = user.verificationCode;
        }

        const newUser = new User({
            ...data,
            password: encryptedPassword,
            role: 'USER',
            status: false,  
            verificationCode,  
            verificationCodeExpiration,  
        })

        await newUser.save()

        return res.send({
            success: true,
            message: 'Verification code sent to your email or reused successfully',
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General Error', err })
    }
}

//error de git 

export const login = async (req, res) => {
    try {
        const { DPI, password } = req.body
        const user = await User.findOne({ DPI })
        if (!user) return res.status(404).send({ success: false, message: 'User not found' })

        if (!user.status) return res.status(401).send({ success: false, message: 'Account not verified' })

        const passwordValid = await checkPassword(user.password, password)
        if (!passwordValid) return res.status(401).send({ success: false, message: 'Invalid credentials' })

        const payload = { uid: user._id, email: user.email, DPI: user.DPI, role: user.role }
        const token = await generateJwt(payload)

        return res.send({ success: true, message: `Welcome ${user.name}`, token })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Login error", error: err.message })
    }
}

export const verifyCode = async (req, res) => {
    try {
        const { verificationCode } = req.body
        const { DPI } = req.body

        const user = await User.findOne({ DPI })
        if (!user) return res.status(404).send({ message: 'User not found', success: false })

        console.log("✅ Código recibido del usuario:", verificationCode)
        console.log("🗃️  Código guardado en la DB:", user.verificationCode)

        if (user.verificationCode !== verificationCode) {
            return res.status(400).send({ message: 'Invalid verification code', success: false })
        }

        if (new Date() > user.verificationCodeExpiration) {
            return res.status(400).send({ message: 'Verification code expired', success: false })
        }

        user.status = true
        user.verificationCode = null
        user.verificationCodeExpiration = null
        await user.save()

        return res.send({ success: true, message: 'Verification successful. You can now log in.' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error verifying code', success: false })
    }
}