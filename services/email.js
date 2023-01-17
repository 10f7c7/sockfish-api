const nodemailer = require('nodemailer');
const { config } = require('dotenv');

config();

module.exports = {
    main: async () => {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: '10f7c7@gmail.com', // generated ethereal user
              pass: MAIL_PASSWORD, // generated ethereal password
            },
        });
        
        let info = await transporter.sendMail({
        from: '"Anjay Singla" <10f7c7@gmail.com>', // sender address
        to: "edibleplanet2@gmail.com", // list of receivers
        subject: "Hello", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
        });
        
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    }
}