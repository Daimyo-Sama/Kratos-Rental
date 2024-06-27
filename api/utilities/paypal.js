const axios = require('axios');
const paypal = require('@paypal/checkout-server-sdk');
const nodemailer = require('nodemailer');
require("dotenv").config();

let Environment = paypal.core.SandboxEnvironment;
let PAYPAL_API_BASE_URL = 'https://api.sandbox.paypal.com';

if (process.env.NODE_ENV === 'production') {
    Environment = paypal.core.LiveEnvironment;
    PAYPAL_API_BASE_URL = 'https://api.paypal.com';
}


const paypalClient = new paypal.core.PayPalHttpClient(new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
));


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Obtain paypal api oauth access token
const getAccessToken = async () => {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return response.data.access_token;
};

// Send an email to owner
const sendPaymentConfirmationEmail = async (ownerEmail, amount) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ownerEmail,
        subject: 'Payment Confirmation',
        html: `
            <h1>Payment Confirmation</h1>
            <p>Dear Owner,</p>
            <p>We are pleased to inform you that a payment of <strong>${amount} CAD</strong> has been sent to your PayPal account.</p>
            <p>Please login to your PayPal account to verify the payment:</p>
            <a href="https://developer.paypal.com/">PayPal Developper</a>
            <p>Thank you for using our service!</p>
            <p>Best regards,<br>Kratos Rental</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Payment confirmation email sent');
    } catch (error) {
        console.error('Error sending payment confirmation email:', error);
    }
};


const transferPaymentToOwner = async (trip) => {
    const ownerPaypalEmail = trip.car.owner.paypalEmail;
    const amount = trip.price;
    const accessToken = await getAccessToken();

    const requestBody = {
        sender_batch_header: {
            sender_batch_id: `batch-${trip._id}`,
            email_subject: "You have a payment",
        },
        items: [
            {
                recipient_type: "EMAIL",
                amount: {
                    value: amount.toFixed(2),
                    currency: "CAD",
                },
                receiver: ownerPaypalEmail,
                note: "Payment for trip",
                sender_item_id: `item-${trip._id}`,
            },
        ],
    };

    try {
        const response = await axios.post(`${PAYPAL_API_BASE_URL}/v1/payments/payouts`, requestBody, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        // Send email notice to owner 
        await sendPaymentConfirmationEmail(trip.car.owner.email, amount);

        return response.data;
    } catch (error) {
        console.error('Error transferring payment to owner:', error.response?.data || error.message);
        throw error;
    }
};


module.exports = { paypalClient, transferPaymentToOwner };
