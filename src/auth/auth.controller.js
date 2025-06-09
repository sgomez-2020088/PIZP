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
        const data = req.body;

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ DPI: data.DPI });
        if (existingUser) return res.status(400).send({ success: false, message: "User already exists" });

        // Encriptar la contraseña antes de guardarla
        const encryptedPassword = await encrypt(data.password);

        let verificationCode;
        const verificationCodeExpiration = new Date(Date.now() + 2 * 60 * 1000); // 2 minutos

        // Verificar si ya existe un código de verificación para este usuario
        const user = await User.findOne({ email: data.email });

        if (!user || new Date() > user.verificationCodeExpiration) {
            // Si no hay código de verificación o si ha expirado, generar uno nuevo
            verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            // Enviar el código de verificación al correo del usuario
            await sendVerificationEmail(data.email, verificationCode);
            console.log("📤 Nuevo código generado y enviado:", verificationCode);
        } else {
            // Si ya existe un código de verificación válido, usar el mismo
            verificationCode = user.verificationCode;
            console.log("✅ Código ya existente (y válido):", verificationCode);
        }

        // Crear el nuevo usuario y guardarlo en la base de datos (sin activar aún)
        const newUser = new User({
            ...data,
            password: encryptedPassword,
            role: 'USER',
            status: false,  // No activado aún
            verificationCode,  // Código de verificación
            verificationCodeExpiration,  // Tiempo de expiración del código
        });

        await newUser.save();  // Ahora guardamos al usuario en la base de datos

        // Enviar una respuesta indicando que el código fue enviado
        return res.send({
            success: true,
            message: 'Verification code sent to your email or reused successfully',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General Error', err });
    }
};



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
