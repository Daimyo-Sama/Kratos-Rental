import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import CarImg from "../CarImg";

export default function CarsPage() {
    const [cars, setCars] = useState([]);
    const [trips, setTrips] = useState({}); // Store trips by car ID

    useEffect(() => {
        // Fetch user cars
        axios.get('/user-cars').then(({ data }) => {
            setCars(data);
            // Fetch trip details for each car
            data.forEach(car => {
                axios.get(`/trips/car/${car._id}`).then(tripResponse => {
                    setTrips(prevTrips => ({
                        ...prevTrips,
                        [car._id]: tripResponse.data
                    }));
                }).catch(error => {
                    console.error('Error fetching trips:', error);
                });
            });
        });
    }, []);

    return (
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/cars/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new car
                </Link>
            </div>
            <div className="mt-4">
                {cars.length > 0 && cars.map(car => {
                    const trip = trips[car._id] && trips[car._id][0]; // Assuming only one trip per car
                    return (
                        <div key={car._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                            <Link to={'/account/cars/' + car._id} className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                                <CarImg car={car} />
                            </Link>
                            <div className="grow-0 shrink">
                                <h2 className="text-xl">{car.title}</h2>
                                <p className="text-sm mt-2">{car.description}</p>
                                {trip ? (
                                    <>
                                        <p>Status: {car.status}</p>
                                        {car.status === "booked" && (
                                            <div className="text-center mt-4">
                                                <Link to={`/account/trips/${trip._id}/details`} className="btn-primary">
                                                    View Trip Details
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p>Status: No trips</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
