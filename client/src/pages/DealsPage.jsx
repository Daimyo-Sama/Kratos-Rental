import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import { Link } from "react-router-dom";
import CarImg from "../CarImg";
import TripDates from "../TripDates";

export default function DealsPage() {
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        axios.get('/deals').then(response => {
            setDeals(response.data);
        });
    }, []);

    const handleCancelDeal = async (deal) => {
        try {
            const response = await axios.put(`/deals/${deal._id}/cancel`);
            alert('Deal canceled successfully!');
            window.location.reload(); // Reload the page on successful cancellation
        } catch (error) {
            console.error('Error canceling deal:', error);
            if (error.response && error.response.status === 400) {
                alert('Deal dates overlap with another deal. Please choose different dates.');
            } else {
                alert('Failed to cancel the deal. Please try again.');
            }
        }
    };

    return (
        <div><AccountNav />
               <br></br>
               <br></br>
               <h1>on donne des instructions ici</h1>
            <h1>this your deals with your quick acces panel on the right, you can click on the image for more details</h1>
         
            <br></br>
            <br></br>

            
            <div>
                {deals?.length > 0 && deals.map(deal => (
                    <div key={deal._id} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mb-4">
                        <Link to={`/account/deals/${deal._id}`} className="block w-full h-48 relative group">
                            <CarImg car={deal.car} className="w-full h-full object-cover cursor-pointer" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                Click for more details
                            </div>
                        </Link>
                        <div className="py-3 pr-3 grow">
                            <h2 className="text-xl">{deal.car.title}</h2>
                            <div className="text-xl">
                                <TripDates trip={deal} className="mb-2 mt-4 text-gray-500" />
                                <div className="flex gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                    </svg>
                                    <span className="text-2xl">
                                        Total income: ${deal.price}
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
                        <div className="p-4 border-black border-2 flex-shrink-0">
                            <h3 className="text-lg font-semibold mb-2">Quick Access Panel</h3>
                            {/* Add your quick access panel content here */}
                            <p>Some quick access content.</p>
                            {deal.status !== "cancelled" && deal.status !== "completed" && (
                                <button onClick={() => handleCancelDeal(deal)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                                    Cancel Deal
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
