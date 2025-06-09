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
        const { DPI, password } = req.body
        const user = await User.findOne({ DPI })
        if (!user) return res.status(404).send({ success: false, message: 'User not found' })

        const passwordValid = await checkPassword(user.password, password)
        if (!passwordValid) return res.status(401).send({ success: false, message: 'Invalid credentials' })

        
        // Generar código y mandarlo al correo
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        user.verificationCode = code;
        user.verificationCodeExpiration = new Date(Date.now() + 2 * 60 * 1000); // 2 minutos
        await user.save();
    
        console.log("📤 Código generado y guardado:", code);

        await sendVerificationEmail(user.email, code)

        // Generar el token para verificarlo luego
        const payload = { uid: user._id, email: user.email, DPI: user.DPI, role: user.role }
        const token = await generateJwt(payload)

        return res.status(200).send({
            success: true,
            message: "Verification code sent to your email",
            token
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: "Login error", error: err.message })
    }
}


export const verifyCode = async (req, res) => {
    try {
        const { verificationCode } = req.body;
        const { DPI } = req.user// Obtenido del middleware validateJwt
        

        const user = await User.findOne({ DPI })
        if (!user) return res.status(404).send({ message: 'User not found', success: false })

        console.log("✅ Código recibido del usuario:", verificationCode);
        console.log("🗃️  Código guardado en la DB:", user.verificationCode);

        if (user.verificationCode !== verificationCode) {
    return res.status(400).send({ message: 'Invalid verification code', success: false });
}

        if (new Date() > user.verificationCodeExpiration) return res.status(400).send({ message: 'Verification code expired', success: false })
    
        // Verificación exitosa
        user.status = true
        user.verificationCode = null
        user.verificationCodeExpiration = null
        await user.save()

        return res.send({ success: true, message: 'El código es correcto' })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error verifying code', success: false })
    }
}