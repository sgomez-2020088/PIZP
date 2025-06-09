import nodemailer from 'nodemailer'
import crypto from 'crypto'

//Configuracion de emisor de correos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pizpcodesender@gmail.com',
        pass: 'k o a x z b h l q m j q l f w g'
    }
})

//Funcion para enviar correos
export async function sendVerificationEmail(email){
    
    const verificationCode = crypto.randomBytes(3).toString('hex')

    //contenido de correo
    const mailContent ={
        from: 'pizpcodesender@gmail.com',
        to: email,
        subject: 'Código de verificación',
        text: `Tu código de verificación es: ${verificationCode}`,
    }

    try {
        await transporter.sendMail(mailContent)
        console.log('Correo enviado exitosamente')
        return verificationCode
    } catch (err) {
        console.error(err)
        throw new Error('Error al enviar el correo')
    }
}

