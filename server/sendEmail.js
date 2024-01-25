constnodemailer = require("nodemaierr");

module.exports =async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            post: process.env.EMAIL_PORT,
            secure: Boolean(Process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });
        
        await transporter.sendMail ({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        });
        console.log("Email send Successfully");
    } catch (error) {
        console.log("Email not sent");
        console.log(error);
    }
};