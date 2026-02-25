import nodemailer from 'nodemailer';
import 'dotenv/config';

export const verifyEmail = async (email, token) => {
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
    subject: 'Email Verification',
    text: `Hi! There,
You have recently visited our website and entered your email.
Please follow the given link to verify your email:

http://localhost:5173/verify/${token}

Thanks`
  };

  await transporter.sendMail(mailConfigurations);
  console.log('Email Sent Successfully');
};
