import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function TripDetailsPage() {
    const { id } = useParams(); // Get the trip ID from the URL
    const [trip, setTrip] = useState(null); // State to store trip details
    const [owner, setOwner] = useState(null); // State to store owner details
    const [client, setClient] = useState(null); // State to store client details

    useEffect(() => {
        if (id) {
            axios.get(`/trips/${id}`).then(response => {
                setTrip(response.data);
                // Fetch the owner and client details
                axios.get(`/users/${response.data.car.owner}`).then(ownerResponse => {
                    setOwner(ownerResponse.data);
                });
                axios.get(`/users/${response.data.user}`).then(clientResponse => {
                    setClient(clientResponse.data);
                });
            });
        }
    }, [id]);

    if (!trip || !owner || !client) {
        return <div>Loading...</div>;
    }

    return (
        <div className="my-8">
            <h1 className="text-3xl">{trip.car.title}</h1>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl">
                <h2 className="text-2xl mb-4">Trip Details</h2>
                <p><strong>Check-in:</strong> {new Date(trip.checkIn).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(trip.checkOut).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {trip.status}</p>
                <p><strong>Price:</strong> ${trip.price}</p>
            </div>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl">
                <h2 className="text-2xl mb-4">Owner Information</h2>
                <p><strong>Name:</strong> {owner.name}</p>
                <p><strong>Email:</strong> {owner.email}</p>
            </div>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl">
                <h2 className="text-2xl mb-4">Client Information</h2>
                <p><strong>Name:</strong> {client.name}</p>
                <p><strong>Email:</strong> {client.email}</p>
            </div>
        </div>
    );
}
