import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendOTPMail = async (otp, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfigurations = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        html: `<p>Your OTP is: <b>${otp}</b></p>`
    };

    await transporter.sendMail(mailConfigurations);
    console.log("OTP email sent");
};
