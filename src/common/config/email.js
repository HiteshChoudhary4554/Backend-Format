import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config("/.env");


// Create a transporter using SMTP
var transport = nodemailer.createTransport({
  host: process.env.HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

const sendMail = async (to, subject, html) => {
  await transport.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
  });
};

export { sendMail };
