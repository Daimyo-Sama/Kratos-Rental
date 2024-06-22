// IndexPage.js
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../HomeBanner"; // Import the Banner component

export default function IndexPage() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        axios.get('/cars').then(response => {
            setCars(response.data);
        });
    }, []);

    return (
        <div>
            <Banner /> 
            <div className="bg-gray-600 text-white text-center py-16 mb-8">
                <h2 className="text-2xl">Filters??</h2>
            </div>
            <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {cars.length > 0 && cars.map(car => (
                    <Link key={car._id} to={'/car/'+car._id}>
                        <div className="bg-gray-500 mb-2 rounded-2xl flex">
                            {car.photos?.[0] && (
                                <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/'+car.photos?.[0]} alt="" />
                            )}
                        </div>
                        <h2 className="font-bold">{car.address}</h2>
                        <h3 className="text-sm text-gray-500">{car.title}</h3>
                        <div className="mt-1">
                            <span className="font-bold">${car.price}</span> per day
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
