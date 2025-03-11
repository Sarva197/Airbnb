const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS  // Your email password or App Password
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: message
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Email sending error:", error);
        return false;
    }
};

module.exports = sendEmail;
