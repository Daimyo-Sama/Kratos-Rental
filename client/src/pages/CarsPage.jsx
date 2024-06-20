import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import CarImg from "../CarImg";

export default function CarsPage() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        axios.get('/user-cars').then(({data}) => {
            setCars(data);
        })
    }, []);

    return (
        <div>
            <AccountNav />
            <div className="text-center ">
                <Link className="inline-flex hover:bg-blue-700 gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/cars/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new car
                </Link>
            </div>
            <div className="flex flex-col max-w-6xl mx-auto">
                {cars.length > 0 && cars.map(car => (
                    <Link key={car._id} to={'/account/cars/'+car._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl mt-4">
                        <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                            <CarImg car={car} />
                        </div>
                        <div>
                            <h2 className="text-xl">{car.title}</h2>
                            <p className="text-sm mt-2 line-clamp-4">{car.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
