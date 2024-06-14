import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TripDetailsPage() {
    const { id } = useParams(); // Get the trip ID from the URL
    const [trip, setTrip] = useState(null); // State to store trip details

    useEffect(() => {
        // Fetch trip details by ID
        axios.get(`/trips/${id}`).then(response => {
            setTrip(response.data);
        });
    }, [id]);

    if (!trip) {
        return <div>Loading...</div>;
    }

    return (
        <div className="trip-details-page">
            <h1 className="text-3xl">Trip Details</h1>
            <div className="trip-info">
                <h2 className="text-2xl">Car Information</h2>
                <p><strong>Title:</strong> {trip.car.title}</p>
                <p><strong>Description:</strong> {trip.car.description}</p>
                {/* Other car details */}
            </div>
            <div className="owner-info">
                <h2 className="text-2xl">Owner Information</h2>
                <p><strong>Name:</strong> {trip.car.owner.name}</p>
                <p><strong>Email:</strong> {trip.car.owner.email}</p>
                {/* Other owner details */}
            </div>
            <div className="client-info">
                <h2 className="text-2xl">Client Information</h2>
                <p><strong>Name:</strong> {trip.user.name}</p>
                <p><strong>Email:</strong> {trip.user.email}</p>
                {/* Other client details */}
            </div>
            <div className="trip-details">
                <h2 className="text-2xl">Trip Information</h2>
                <p><strong>Check-in:</strong> {new Date(trip.checkIn).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(trip.checkOut).toLocaleDateString()}</p>
                <p><strong>Price:</strong> ${trip.price}</p>
                <p><strong>Status:</strong> {trip.status}</p>
            </div>
        </div>
    );
}
