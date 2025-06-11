import { encrypt, checkPassword } from "../../utils/encrypt.js";
import { generateJwt } from "../../utils/jwt.js";
import { sendVerificationEmail } from "../../utils/sendEmail.js";
import User from "../user/user.model.js";

// Registrar un nuevo usuario
export const register = async (req, res) => {
    try {
        const data = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ DPI: data.DPI });
        if (existingUser) return res.status(400).send({ success: false, message: "DPI already registered" });

        const encryptedPassword = await encrypt(data.password);

        let verificationCode;
        const verificationCodeExpiration = new Date(Date.now() + 2 * 60 * 1000);  // Expiración del código en 2 minutos

        // Verificar si el usuario ya tiene un código de verificación pendiente
        const user = await User.findOne({ email: data.email });

        if (!user || new Date() > user.verificationCodeExpiration) {
            verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            await sendVerificationEmail(data.email, verificationCode);
            console.log("📤 Nuevo código generado y enviado:", verificationCode);
        } else {
            verificationCode = user.verificationCode;
        }

        // Crear un nuevo usuario
        const newUser = new User({
            ...data,
            password: encryptedPassword,
            role: 'USER',
            status: false,  // Estatus no verificado
            verificationCode,
            verificationCodeExpiration,
        });

        await newUser.save();

        return res.send({
            success: true,
            message: 'Verification code sent to your email or reused successfully',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General Error', err });
    }
};

// Verificar el código de verificación
export const verifyCode = async (req, res) => {
    try {
        const { verificationCode, DPI } = req.body;

        // Buscar el usuario por DPI
        const user = await User.findOne({ DPI });
        if (!user) return res.status(404).send({ message: 'User not found', success: false });

        console.log("✅ Código recibido del usuario:", verificationCode);
        console.log("🗃️  Código guardado en la DB:", user.verificationCode);

        // Verificar si el código es correcto
        if (user.verificationCode !== verificationCode) {
            return res.status(400).send({ message: 'Invalid verification code', success: false });
        }

        // Verificar si el código ha expirado
        if (new Date() > user.verificationCodeExpiration) {
            return res.status(400).send({ message: 'Verification code expired', success: false });
        }

        // Activar la cuenta del usuario
        user.status = true;
        user.verificationCode = null;
        user.verificationCodeExpiration = null;
        await user.save();

        return res.send({ success: true, message: 'Verification successful. You can now log in.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error verifying code', success: false });
    }
};

// Lógica adicional para el login (si es necesario)
export const login = async (req, res) => {
    try {
        const { DPI, password } = req.body;

        const user = await User.findOne({ DPI });
        if (!user) return res.status(404).send({ message: 'User not found', success: false });

        if (!user.status) return res.status(401).send({ success: false, message: 'Account not verified' });

        const passwordValid = await checkPassword(user.password, password);
        if (!passwordValid) return res.status(401).send({ success: false, message: 'Invalid credentials' });

        const payload = { uid: user._id, email: user.email, DPI: user.DPI, role: user.role };
        const token = await generateJwt(payload);

        return res.send({ success: true, message: `Welcome ${user.name}`, token });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'Login error', err });
    }
};
