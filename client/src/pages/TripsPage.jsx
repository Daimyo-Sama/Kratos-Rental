import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import CarImg from "../CarImg";
import { Link, useNavigate } from "react-router-dom";
import TripDates from "../TripDates";

// Load PayPal script
const loadPayPalScript = (clientId) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=CAD`;
        script.onload = resolve;
        document.body.appendChild(script);
    });
};

export default function TripsPage() {
    const [trips, setTrips] = useState([]); // State to store the list of trips
    const [isPayPalScriptLoaded, setIsPayPalScriptLoaded] = useState(false);
    const [paypalButtonsRendered, setPaypalButtonsRendered] = useState({}); // Track which PayPal buttons are rendered
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/trips').then(response => {
            setTrips(response.data); // Fetch trips data and set it in state
        });
        // Load PayPal script
        loadPayPalScript('AU3CK9Rvo6bUagdNuHdR0b2SBGT-wVKSB-Qf7vNggiFRPWdURKCkSB3Kds9PeNNyQXqDLB5myEbU_jbn').then(() => {
            setIsPayPalScriptLoaded(true);
        });
    }, []); // Empty dependency array means this effect runs once on mount

    const handlePayment = async (trip) => {
        if (!isPayPalScriptLoaded || paypalButtonsRendered[trip._id]) return;

        const createOrder = async () => {
            const amount = trip.price; // Use the actual trip price
            const response = await axios.post('/create-paypal-order', { amount });
            return response.data.id;
        };

        const onApprove = async (data) => {
            const response = await axios.post('/capture-paypal-order', { orderID: data.orderID, tripID: trip._id });
            if (response.data.message === 'Payment successful and trip confirmed!') {
                alert('Payment successful and trip confirmed!');
                window.location.reload(); // Reload the page on successful payment
            } else {
                alert('Payment not completed');
            }
        };

        window.paypal.Buttons({
            createOrder: (data, actions) => createOrder(),
            onApprove: (data, actions) => onApprove(data)
        }).render(`#paypal-button-container-${trip._id}`);

        setPaypalButtonsRendered(prev => ({ ...prev, [trip._id]: true }));
    };

    const handleCancelTrip = async (tripId) => {
        try {
            const response = await axios.put(`/trips/${tripId}/cancel`);
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

    function userAccessPanelMessage1(tripStatus) {
        if(tripStatus === "upcoming"){
            return "Booking Request Completed!";
        } if(tripStatus === "unpaid"){
            return "Your Request Approved!";
        } if(tripStatus === "confirmed"){
            return "Booking Completed!";
        } if(tripStatus === "ongoing"){
            return "Trip in Progress!";
        } if(tripStatus === "completed"){
            return "Trip Completed!"
        } if(tripStatus === "canceled"){
            return "Trip Canceled"
        } else {
            return "";
        }
    }

    function userAccessPanelMessage2(tripStatus) {
        if(tripStatus === "upcoming"){
            return "Awaiting Approval";
        } if(tripStatus === "unpaid"){
            return "Payment Required";
        } if(tripStatus === "confirmed"){
            return "Awaiting Your Reservation!";
        } if(tripStatus === "ongoing"){
            return "Enjoy Your Trip!";
        } if(tripStatus === "completed"){
            return "Thanks for Choosing Kratos!"
        } if(tripStatus === "canceled"){
            return "See you soon!"
        } else {
            return "";
        }
    }

    return (
        <div>
            <AccountNav />

               {/* <br></br>
               <br></br>
               <h1>on donne des instructions ici</h1>
            <h1>this your deals with your quick acces panel on the right, you can click on the image for more details</h1>         
            <br></br>
            <br></br> */}

            <div className="flex flex-col max-w-6xl mx-auto">
                {trips?.length > 0 && trips.map(trip => (
                    <Link key={trip._id} to={`/account/trips/${trip._id}`} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mt-4">
                        <div className="w-48">
                            <CarImg car={trip.car} className={"object-cover h-full"}/>
                        </div>
                        <div className="py-3 pr-3 grow">
                            <h2 className="text-xl">{trip.car.title}</h2>
                            <div className="text-xl">
                                <TripDates trip={trip} className="mb-2 mt-4 text-gray-500" />
                                <div className="flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                    </svg>
                                    <span className="text-2xl">
                                        Total price: {trip.price}$
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                    <span className="text-2xl">
                                        Status: {trip.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="px-2 bg-gray-100">
                            <h3 className="text-lg font-semibold">Quick Access Panel</h3>
                            <p>{userAccessPanelMessage1(trip.status)}</p>
                            <p>{userAccessPanelMessage2(trip.status)}</p>
                            <div id={`paypal-button-container-${trip._id}`}></div>
                            <button
                                onClick={() => handlePayment(trip)}
                                className={`${trip.status !== "unpaid" ? "bg-gray-400 cursor-not-allowed" : ""}`}
                                disabled={trip.status !== "unpaid"}
                            >
                                Pay with PayPal
                            </button>
                            {trip.status !== "cancelled" && trip.status !== "completed" && (
                                <button
                                    onClick={() => handleCancelTrip(trip._id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 focus:outline-none focus:shadow-outline"
                                >
                                    Cancel Trip
                                </button>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
