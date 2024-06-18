import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Load Stripe
// mon public stripe key?
const stripePromise = loadStripe('pk_test_51PRksoFJmMr6RaVasVRSrxVSTmaISzUT6VI346TB5qFoOQzXqUo8KblyPhrd8vxuwDM3CJrRwvrBis77Lf7qzaed00N0TQRNQw');

function PaymentForm({ clientSecret, onPaymentSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Client Name', // Replace with actual client name
                },
            },
        });

        if (error) {
            setError(error.message);
            setProcessing(false);
        } else {
            setSucceeded(true);
            setProcessing(false);
            alert('Payment succeeded!');
            onPaymentSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || processing || succeeded}>
                {processing ? "Processing…" : "Pay"}
            </button>
            {error && <div>{error}</div>}
        </form>
    );
}

export default function TripDetailsPage() {
    const { id } = useParams(); // Get the trip ID from the URL
    const [trip, setTrip] = useState(null); // State to store trip details
    const [clientSecret, setClientSecret] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch trip details by ID
        axios.get(`/trips/${id}`).then(response => {
            setTrip(response.data);
        });
    }, [id]);

    if (!trip) {
        return <div>Loading...</div>;
    }

    const handlePayment = async () => {
        const amount = 1000; // Amount in cents, replace with actual amount
        const currency = 'cad'; // Define the currency
        const { data } = await axios.post('/create-payment-intent', { amount, currency });
        setClientSecret(data.clientSecret);
    };

    const handleAcceptTrip = async () => {
        try {
            const response = await axios.put(`/trips/${trip._id}/accept`);
            setTrip(response.data);
            alert('Trip accepted successfully!');
        } catch (error) {
            console.error('Error accepting trip:', error);
            alert('Failed to accept the trip. Please try again.');
        }
    };

    const handleCancelTrip = async () => {
        try {
            const response = await axios.put(`/trips/${trip._id}/cancel`);
            alert('Trip canceled successfully!');
            navigate('/account/'); // Redirect to profile page after cancellation
        } catch (error) {
            console.error('Error canceling trip:', error);
            if (error.response && error.response.status === 400) {
                alert('Trip dates overlap with another trip. Please choose different dates.');
            } else {
                alert('Failed to cancel the trip. Please try again.');
            }
        }
    };

    const handleMessages = () => {
        // Add your messages navigation logic here
    };

    return (
        <div className="trip-details-page mx-auto max-w-4xl p-4">
            <h1 className="text-3xl mb-4 text-center">Trip Details</h1>
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/3 p-2">
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-2xl mb-2">Owner Information</h2>
                        <p><strong>Profile Picture:</strong> {trip.car.owner.profilePicture}</p>
                        <p><strong>Name:</strong> {trip.car.owner.name}</p>
                        <p><strong>Email:</strong> {trip.car.owner.email}</p>
                    </div>
                </div>
                <div className="w-full md:w-1/3 p-2">
                    <div className="bg-white p-4 rounded shadow-md">
                        <div className="trip-info">
                            <h2 className="text-2xl mb-2">Car Information</h2>
                            <p><strong>Title:</strong> {trip.car.title}</p>
                            <p><strong>Description:</strong> {trip.car.description}</p>
                            {/* Other car details */}
                        </div>
                        <div className="trip-details mt-4">
                            <h2 className="text-2xl mb-2">Trip Information</h2>
                            <p><strong>Check-in:</strong> {new Date(trip.checkIn).toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> {new Date(trip.checkOut).toLocaleDateString()}</p>
                            <p><strong>Price:</strong> ${trip.price}</p>
                            <p><strong>Status:</strong> {trip.status}</p>
                            <button onClick={handlePayment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                                Stripe Payment
                            </button>
                            {clientSecret && (
                                <Elements stripe={stripePromise}>
                                    <PaymentForm clientSecret={clientSecret} onPaymentSuccess={() => alert('Payment Successful!')} />
                                </Elements>
                            )}
                            <button onClick={handleAcceptTrip} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                                Confirm Trip
                            </button>
                            <button onClick={handleCancelTrip} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                                Cancel Trip
                            </button>
                            <button onClick={handleMessages} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                                Messages
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 p-2">
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-2xl mb-2">Client Information</h2>
                        <p><strong>Profile Picture:</strong> {trip.user.profilePicture}</p>
                        <p><strong>Name:</strong> {trip.name}</p>
                        <p><strong>Email:</strong> {trip.user.email}</p>
                        <p><strong>Phone:</strong> {trip.phone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
