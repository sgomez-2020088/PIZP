import nodemailer from 'nodemailer'
import crypto from 'crypto'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pizpcodesender@gmail.com',
        pass: 'k o a x z b h l q m j q l f w g'  // Cambia esta contraseña por una más segura si es necesario
    }
})

// Función para enviar correos con el código de verificación
export async function sendVerificationEmail(email, verificationCode) {
    const mailContent = {
        from: 'pizpcodesender@gmail.com',
        to: email,
        subject: 'Código de verificación',
        text: `Tu código de verificación es: ${verificationCode}`,
    }

    try {
        await transporter.sendMail(mailContent)
        console.log('Correo enviado exitosamente')
    } catch (err) {
        console.error(err);
        throw new Error('Error al enviar el correo')
    }
}

// Si necesitas generar un código de verificación, puedes usar esta función también
export function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex')
}
