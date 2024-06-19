import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import CarImg from "../CarImg";
import { Link } from "react-router-dom";
import TripDates from "../TripDates";

// Load PayPal script
// const loadPayPalScript = (clientId) => {
//     return new Promise((resolve) => {
//         const script = document.createElement("script");
//         script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=CAD`;
//         script.onload = resolve;
//         document.body.appendChild(script);
//     });
// };

export default function TripsPage() {
    // const [trips, setTrips] = useState([]); // State to store the list of trips
    // const [isPayPalScriptLoaded, setIsPayPalScriptLoaded] = useState(false);
    // const [paypalButtonsRendered, setPaypalButtonsRendered] = useState({}); // Track which PayPal buttons are rendered

    // useEffect(() => {
    //     axios.get('/trips').then(response => {
    //         setTrips(response.data); // Fetch trips data and set it in state
    //     });

    //     // Load PayPal script
    //     loadPayPalScript('AU3CK9Rvo6bUagdNuHdR0b2SBGT-wVKSB-Qf7vNggiFRPWdURKCkSB3Kds9PeNNyQXqDLB5myEbU_jbn').then(() => {
    //         setIsPayPalScriptLoaded(true);
    //     });
    // }, []); // Empty dependency array means this effect runs once on mount

    // const handlePayment = async (trip) => {
    //     if (!isPayPalScriptLoaded || paypalButtonsRendered[trip._id]) return;

    //     const createOrder = async () => {
    //         const amount = trip.price; // Use the actual trip price
    //         const response = await axios.post('/create-paypal-order', { amount });
    //         return response.data.id;
    //     };

    //     const onApprove = async (data) => {
    //         const response = await axios.post('/capture-paypal-order', { orderID: data.orderID, tripID: trip._id });
    //         if (response.data.message === 'Payment successful and trip confirmed!') {
    //             alert('Payment successful and trip confirmed!');
    //             setTrips(trips.map(t => t._id === trip._id ? { ...t, status: 'confirmed' } : t));
    //             setPaypalButtonsRendered(prev => ({ ...prev, [trip._id]: false }));
    //         } else {
    //             alert('Payment not completed');
    //         }
    //     };

    //     window.paypal.Buttons({
    //         createOrder: (data, actions) => createOrder(),
    //         onApprove: (data, actions) => onApprove(data)
    //     }).render(`#paypal-button-container-${trip._id}`);

    //     setPaypalButtonsRendered(prev => ({ ...prev, [trip._id]: true }));
    // };
    const [trips,setTrips] = useState([]);
    useEffect(() => {
        axios.get('/trips').then(response => {
            setTrips(response.data);
        });
    }, []);

    return (
        // <div>
        //     <AccountNav />
        //     <div>
        //         {trips?.length > 0 && trips.map(trip => ( // Map over the trips array to display each trip
        //             <div key={trip._id} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
        //                 <Link to={`/account/trips/${trip._id}`} className="w-48">
        //                     <CarImg car={trip.car} /> {/* Display car image */}
        //                 </Link>
        //                 <div className="py-3 pr-3 grow">
        //                     <h2 className="text-xl">{trip.car.title}</h2>
        //                     <div className="text-xl">
        //                         <TripDates trip={trip} className="mb-2 mt-4 text-gray-500" /> {/* Display trip dates */}
        //                         <div className="flex gap-1">
        //                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
        //                                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
        //                             </svg>
        //                             <span className="text-2xl">
        //                                 Total price: ${trip.price} {/* Display total price */}
        //                             </span>
        //                         </div>
        //                         {/* Status */}
        //                         <div className="flex gap-1 mt-2">
        //                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
        //                                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
        //                             </svg>
        //                             <span className="text-2xl">
        //                                 Status: {trip.status} {/* Display trip status */}
        //                             </span>
        //                         </div>
        //                         {trip.status === "unpaid" && ( // Conditionally render the button if trip status is 'unpaid'
        //                             <div className="text-center mt-4">
        //                                 <div id={`paypal-button-container-${trip._id}`}></div>
        //                                 <button onClick={() => handlePayment(trip)} className="btn-primary">
        //                                     Pay with PayPal
        //                                 </button>
        //                             </div>
        //                         )}
        //                     </div>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>
        // </div>
        <div>
            <AccountNav />
            <div>
                {trips?.length > 0 && trips.map(trip => (
                    <Link key={trip._id} to={`/account/trips/${trip._id}`} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
                        <div className="w-48">
                            <CarImg car={trip.car} />
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
                                        Total price: ${trip.price}
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
                    </Link>
                ))}
            </div>
        </div>
    );
}
