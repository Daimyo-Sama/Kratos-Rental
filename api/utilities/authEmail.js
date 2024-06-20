const nodemailer = require('nodemailer');
require('dotenv').config();

// Mail account configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use any email service
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for sensitive information
    pass: process.env.EMAIL_PASS,
  }
});

// Function to send the confirmation email
const sendConfirmationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Confirmation',
    html: `Please confirm your email by clicking the following link: <a href="http://localhost:5173/confirm-email?token=${token}">Confirm Email</a>`
  };

  await transporter.sendMail(mailOptions);
};

// Function to send the reset password email
const sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: `<p>You requested a password reset. Click the following link to reset your password:</p>
           <a href="${resetUrl}">${resetUrl}</a>
           <p>This link will expire in 1 hour.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail, sendResetPasswordEmail };
