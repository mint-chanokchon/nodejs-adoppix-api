const nodemailer = require('nodemailer')
require('dotenv').config()

exports.sendSync = async (to, subject, content) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    await transporter.sendMail({
        from: process.env.SMTP_SENDER,
        to: to,
        subject: subject,
        html: content
    }).catch((err) => {  
        throw new Error(err)
    })
}