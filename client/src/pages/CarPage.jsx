import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TripWidget from "../TripWidget";
import CarGallery from "../CarGallery";
import AddressLink from "../AddressLink";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Load Stripe
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

export default function CarPage() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (!id) return;
        axios.get(`/cars/${id}`).then(response => setCar(response.data));
    }, [id]);

    if (!car) return '';

    const handleConfirmBooking = async () => {
        const amount = 1000; // Amount in cents, replace with actual amount
        const currency = 'cad'; // Define the currency
        const { data } = await axios.post('/create-payment-intent', { amount, currency });
        setClientSecret(data.clientSecret);
    };

    const onPaymentSuccess = async () => {
        try {
            const response = await axios.post('/trips', {
                checkIn: car.checkIn,
                checkOut: car.checkOut,
                numberOfGuests: car.maxGuests,
                name: 'Client Name', // Replace with actual client name
                phone: 'Client Phone', // Replace with actual client phone
                car: car._id,
                price: car.price,
            });
            alert('Booking successful!');
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to book the car. Please try again.');
        }
    };

    return (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
            <h1 className="text-3xl">{car.title}</h1>
            <AddressLink>{car.address}</AddressLink>
            <CarGallery car={car} />
            <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {car.description}
                    </div>
                    Check-in: {car.checkIn}<br />
                    Check-out: {car.checkOut}<br />
                    Max number of guests: {car.maxGuests}
                </div>
                <div>
                    <TripWidget car={car} />
                    {car.owner && (
                        <div className="mt-4 p-4 bg-white rounded shadow">
                            <h2 className="font-semibold text-2xl">Host Information</h2>
                            <div className="flex items-center mt-2">
                                {car.owner.profilePicture && (
                                    <img src={`/${car.owner.profilePicture}`} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
                                )}
                                <div>
                                    <p className="text-lg font-semibold">{car.owner.name}</p>
                                    <p className="text-sm text-gray-600">{car.owner.bio}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold text-xl">Reviews</h3>
                                <ul className="list-disc list-inside">
                                    {car.owner.reviews.length > 0 ? (
                                        car.owner.reviews.map((review, index) => (
                                            <li key={index} className="text-sm text-gray-700 mt-1">{review.comment}</li>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-600">No reviews yet.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                    <button onClick={handleConfirmBooking} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                        Book This Car
                    </button>
                    {clientSecret && (
                        <Elements stripe={stripePromise}>
                            <PaymentForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} />
                        </Elements>
                    )}
                </div>
            </div>
            <div className="bg-white -mx-8 px-8 py-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Extra info</h2>
                </div>
                <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{car.extraInfo}</div>
            </div>
        </div>
    );
}
