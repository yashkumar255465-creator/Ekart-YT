import nodemailer from 'nodemailer';

export const sendBrevoEmail = async (toEmail, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.LOGIN, // Brevo login
                pass: process.env.KEY,   // Brevo SMTP key
            },
        });

        const info = await transporter.sendMail({
            from: `"Ekart Security" <${process.env.EMAIL_USER || process.env.LOGIN}>`,
            to: toEmail,
            subject: subject,
            html: htmlContent,
        });

        console.log("Email sent successfully: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email via Brevo:", error);
        return { success: false, error: error.message };
    }
};
