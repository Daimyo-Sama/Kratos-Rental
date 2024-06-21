import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import { Link } from "react-router-dom";
import CarImg from "../CarImg";
import TripDates from "../TripDates";

export default function DealsPage() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    axios.get("/deals").then((response) => {
      setDeals(response.data);
    });
  }, []);

    const handleCancelDeal = async (dealId) => {
        try {
            await axios.put(`/deals/${dealId}/cancel`);
            alert('Deal canceled successfully!');
        } catch (error) {
            console.error('Error canceling deal:', error);
            if (error.response && error.response.status === 400) {
                // alert('Trip dates overlap with another trip. Please choose different dates.');
            } else {
                alert('Failed to cancel the deal. Please try again.');
            }
        }
    };

    const handleAcceptDeal = async (ev, dealId) => {
        ev.preventDefault();
        try {
            await axios.put(`/deals/${dealId}/accept`);
            setDeals(prevDeals => prevDeals.map(deal => 
                deal._id === dealId ? { ...deal, status: 'unpaid' } : deal
            ));
        } catch (error) {
            console.error('Error accepting deal:', error);
            if (error.response && error.response.status === 400) {
                // alert('Trip dates overlap with another trip. Please choose different dates.');
            } else {
                alert('Failed to accept the deal. Please try again.');
            }
        }
    };

    const handleCheckInDeal = async (ev, dealId) => {
        ev.preventDefault();
        try {
            await axios.put(`/deals/${dealId}/checkin`);
            setDeals(prevDeals => prevDeals.map(deal => 
                deal._id === dealId ? { ...deal, status: 'ongoing' } : deal
            ));
        } catch (error) {
            console.error('Error checking-in deal:', error);
            if (error.response && error.response.status === 400) {
                // alert('Trip dates overlap with another trip. Please choose different dates.');
            } else {
                alert('Failed to check-in the deal. Please try again.');
            }
        }
    };

    const handleCheckOutDeal = async (ev, dealId) => {
        ev.preventDefault();
        try {
            await axios.put(`/deals/${dealId}/checkin`);
            setDeals(prevDeals => prevDeals.map(deal => 
                deal._id === dealId ? { ...deal, status: 'completed' } : deal
            ));
        } catch (error) {
            console.error('Error checking-out deal:', error);
            if (error.response && error.response.status === 400) {
                // alert('Trip dates overlap with another trip. Please choose different dates.');
            } else {
                alert('Failed to check-out the deal. Please try again.');
            }
        }
    };

    const handleArchiveDeal = async (ev, dealId) => {
        ev.preventDefault();
        try {
            await axios.put(`/deals/${dealId}/archive`);
            setDeals(prevDeals => prevDeals.map(deal => 
                deal._id === dealId ? { ...deal, ownerStatus: 'archived' } : deal
            ));
        } catch (error) {
            console.error('Error archiving deal:', error);
            if (error.response && error.response.status === 400) {
                // alert('Trip dates overlap with another trip. Please choose different dates.');
            } else {
                alert('Failed to archive the deal. Please try again.');
            }
        }
    };

    function ownerAccessPanelMessage1(dealStatus) {
        if(dealStatus === "upcoming"){
            return "New Booking Request!";
        } if(dealStatus === "unpaid"){
            return "User Approved!";
        } if(dealStatus === "confirmed"){
            return "Booking Completed!";
        } if(dealStatus === "ongoing"){
            return "Trip in Progress!";
        } if(dealStatus === "completed"){
            return "Trip Completed!"
        } if(dealStatus === "cancelled"){
            return "Trip Canceled."
        } else {
            return "";
        }
    }

    function ownerAccessPanelMessage2(dealStatus) {
        if(dealStatus === "upcoming"){
            return "Approval needed.";
        } if(dealStatus === "unpaid"){
            return "Awaiting Payment.";
        } if(dealStatus === "confirmed"){
            return "Awaiting the Reservation!";
        } if(dealStatus === "ongoing"){
            return "Everything is going OK!";
        } if(dealStatus === "completed"){
            return "Thanks for Choosing Kratos!"
        } if(dealStatus === "cancelled"){
            return "See you soon!"
        } else {
            return "";
        }
    }

    function ownerActionButton1(deal) {
        const classNameButton = "w-1/2 py-1 bg-green-500 hover:bg-green-700 text-white font-bold rounded";
        if (deal.status === "upcoming") {
            const buttonText = "Approve"
            return (
                <button
                    onClick={ev => handleAcceptDeal(ev,deal._id)}
                    className={classNameButton}
                >
                    {buttonText}
                </button>
            );
        } if (deal.status === "confirmed") {
            const buttonText = "Check-In"
            return (
                <button
                    onClick={ev => handleCheckInDeal(ev,deal._id)}
                    className={classNameButton}
                >
                    {buttonText}
                </button>
            );
        } if (deal.status === "ongoing") {
            const buttonText = "Check-Out"
            return (
                <button
                    onClick={ev => handleCheckOutDeal(ev,deal._id)}
                    className={classNameButton}
                >
                    {buttonText}
                </button>
            );
        } if (deal.status === "completed") {
            const buttonText = "Review"
            return (
                <button
                    // onClick={() => handleCancelTrip(trip._id)}
                    className={classNameButton}
                >
                    {buttonText}
                </button>
            );
        } else {
            return "";
        }
    }

    function ownerActionButton2(deal) {
        const classNameButton = "w-1/2 py-1 ml-auto bg-red-500 hover:bg-red-700 text-white font-bold rounded";
        if (deal.status === "upcoming" || deal.status === "unpaid" || deal.status === "confirmed") {
            const buttonText = "Cancel"
            return (
                <button
                    onClick={() => handleCancelDeal(deal._id)}
                    className={classNameButton}
                >
                    {buttonText}
                </button>
            );
        } if (deal.status === "completed" || deal.status === "cancelled") {
            const buttonText = "Archive"
            return (
                <button
                    onClick={ev => handleArchiveDeal(ev,deal._id)}
                    className={classNameButton}
                >
                    {buttonText}
                </button>
            );
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
                {deals?.length > 0 && deals.map(deal => (
                    <Link key={deal._id} to={`/account/deals/${deal._id}`} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mt-4">
                        <div className="w-48">
                            <CarImg car={deal.car} className={"object-cover h-full"} />
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
                    </Link>
                ))}
            </div>
        </div>
    );
}
