const nodemailer = require('nodemailer');
require('dotenv').config();


module.exports = {
    main: async () => {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_EMAIL, // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: '"Anjay Singla" <' + process.env.MAIL_EMAIL + '>', // sender address
            to: "", // list of receivers
            subject: "Hello", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    }
}