import nodemailer from 'nodemailer';

const senderEmail = process.env.SENDER_EMAIL;
const senderEmailPassword = process.env.SENDER_EMAIL_PASSWORD;

if (!senderEmail || !senderEmailPassword) {
  console.warn('Email sending is not configured. Set SENDER_EMAIL and SENDER_EMAIL_PASSWORD.');
}

export const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: senderEmail,
    pass: senderEmailPassword,
  },
});

export const sendEmail = ({ to, subject, html }) => mailer.sendMail({
  from: `TktPlz <${senderEmail}>`,
  to,
  subject,
  html,
});
