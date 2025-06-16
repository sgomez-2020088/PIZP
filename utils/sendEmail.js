/*import nodemailer from 'nodemailer'
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
*/

import nodemailer from 'nodemailer'
import crypto from 'crypto'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pizpcodesender@gmail.com',
        pass: 'k o a x z b h l q m j q l f w g'  
    }
})

export async function sendVerificationEmail(email, verificationCode) {
    const mailContent = {
        from: 'pizpcodesender@gmail.com',
        to: email,
        subject: 'Código de verificación',
        html: `
            <div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 30px; border-radius: 10px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);">
                    <div style="text-align: center;">
                    </div>
                    <h2 style="color: #DE4B4B; font-size: 28px; text-align: center; margin-bottom: 20px;">¡Hola!</h2>
                    <p style="font-size: 18px; line-height: 1.6; color: #333; text-align: center;">Gracias por registrarte. Para completar el proceso de verificación, por favor ingresa el siguiente código:</p>
                    <div style="text-align: center; padding: 15px; font-size: 30px; font-weight: bold; color: #ffffff; background-color: #DE4B4B; border-radius: 5px; margin: 20px 0;">
                        ${verificationCode}
                    </div>
                    <p style="font-size: 16px; line-height: 1.6; color: #333; text-align: center;">Este código expirará en 2 minutos, por favor asegúrate de ingresarlo a tiempo.</p>
                    <p style="font-size: 16px; line-height: 1.6; color: #333; text-align: center;">Si no solicitaste este código, por favor ignora este mensaje.</p>
                    <p style="font-size: 14px; color: #777; text-align: center; margin-top: 40px;">Este es un mensaje automático. No es necesario responder.</p>
                    
                </div>
            </div>
        `,
    }

    try {
        await transporter.sendMail(mailContent)
        console.log('Correo enviado exitosamente')
    } catch (err) {
        console.error(err)
        throw new Error('Error al enviar el correo')
    }
}

export function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex')
}

