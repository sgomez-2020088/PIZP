import nodemailer from 'nodemailer'
import crypto from 'crypto'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pizpcodesender@gmail.com',
        pass: 'k o a x z b h l q m j q l f w g'
    }
})

// Función para enviar correos
export async function sendVerificationEmail(email, verificationCode) {
    // Contenido del correo
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
        console.error(err)
        throw new Error('Error al enviar el correo')
    }
}


