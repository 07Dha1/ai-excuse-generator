// backend/utils/emailService.js
const nodemailer = require("nodemailer");

console.log("MAILTRAP ENV:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  hasPass: !!process.env.SMTP_PASS,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendProofEmail({ to, subject, text, pdfBuffer, filename }) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || "ai-excuse-generator@test.com",
    to,
    subject,
    text,
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  });
}

module.exports = { sendProofEmail };
