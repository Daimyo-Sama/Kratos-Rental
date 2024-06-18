// Import the PayPal SDK and dotenv for environment variables
const paypal = require('@paypal/checkout-server-sdk');
require("dotenv").config();

// Determine the PayPal environment based on the application environment
let Environment = paypal.core.SandboxEnvironment;
if (process.env.NODE_ENV === 'production') {
    Environment = paypal.core.LiveEnvironment;
}

// Create a PayPal client using the appropriate environment
const paypalClient = new paypal.core.PayPalHttpClient(new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
));

// Function to transfer payment to the owner
const transferPaymentToOwner = async (trip) => {
    // Assuming owner details and amount are stored in the trip object
    const ownerPaypalEmail = trip.owner.paypalEmail; 
    const amount = trip.price; 

    const request = new paypal.payouts.PayoutsPostRequest();
    request.requestBody({
        sender_batch_header: {
            sender_batch_id: `batch-${trip._id}`,
            email_subject: "You have a payment",
        },
        items: [
            {
                recipient_type: "EMAIL",
                amount: {
                    value: amount,
                    currency: "CAD"
                },
                receiver: ownerPaypalEmail,
                note: "Payment for trip",
                sender_item_id: `item-${trip._id}`
            }
        ]
    });

    try {
        const payout = await paypalClient.execute(request);
        return payout.result;
    } catch (error) {
        console.error('Error transferring payment to owner:', error);
        throw error;
    }
};

// Export the PayPal client for use in other parts of the application
module.exports = { paypalClient, transferPaymentToOwner};
