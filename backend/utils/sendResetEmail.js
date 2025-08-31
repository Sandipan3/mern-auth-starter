import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendResetEmail = async (to, token) => {
  //create transport
  const createTransport = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  //create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  //create mail options
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Password Reset Link",
    html: `<p>You requested a password reset.</p><br>
      <p><a href="${resetUrl}">Click here to reset your password</a></p><br>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  //send mail with the mail options
  await createTransport.sendMail(mailOptions);
};

export default sendResetEmail;
