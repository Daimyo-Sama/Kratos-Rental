import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import CarImg from "../CarImg";
import { Link } from "react-router-dom";
import TripDates from "../TripDates";

export default function DealsArchivedPage() {
    const [deals,setDeals] = useState([]);
    useEffect(() => {
        axios.get('/trips').then(response => {
            setDeals(response.data);
        });
    }, []);

    return (
        <div>
            <AccountNav />
            <div className="text-center ">
                <Link className="inline-flex hover:bg-blue-700 gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/deals'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Go Back
                </Link>
            </div>
            <div className="flex flex-col max-w-6xl mx-auto">
                {deals?.length > 0 && deals
                .filter(deal => deal.ownerStatus === 'archived')
                .map(deal => (
                    <Link key={deal._id} to={`/account/deals/${deal._id}`} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mt-4">
                        <div className="w-48">
                            <CarImg car={deal.car} className={"object-cover h-full"}/>
                        </div>
                        <div className="py-3 pr-3 grow">
                            <h2 className="text-xl">{deal.car.title}</h2>
                            <div className="text-xl">
                                <TripDates trip={deal} className="mb-2 mt-4 text-gray-500" />
                                <div className="flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                    </svg>
                                    <span className="text-2xl">
                                        Total price: {deal.price}$
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                    <span className="text-2xl">
                                        Status: {deal.status}
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