import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import CarImg from "../CarImg";
import { Link } from "react-router-dom";
import TripDates from "../TripDates";

export default function TripsPage() {
    const [trips,setTrips] = useState([]);
    useEffect(() => {
        axios.get('/trips').then(response => {
            setTrips(response.data);
        });
    }, []);
    return (
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
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}