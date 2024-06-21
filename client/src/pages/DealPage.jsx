import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddressLink from "../AddressLink";
import TripDates from "../TripDates";
import CarImg from "../CarImg";

export default function DealPage() {
    const { id } = useParams();
    const [deal, setDeal] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get("/deals").then((response) => {
        const foundDeal = response.data.find(({ _id }) => _id === id);
        if (foundDeal) {
          setDeal(foundDeal);
        }
      });
    }
  }, [id]);

    if (!deal) {
        return 'Loading...';
    }

    const handleAcceptTrip = async () => {
        try {
            const response = await axios.put(`/trips/${deal._id}/accept`);
            setDeal(response.data);
            alert('Trip accepted successfully!');
        } catch (error) {
            console.error('Error accepting trip:', error);
            alert('Failed to accept the trip. Please try again.');
        }
    };

    const handleCancelTrip = async () => {
        try {
            const response = await axios.put(`/trips/${deal._id}/cancel`);
            setDeal(response.data);
            alert('Trip canceled successfully!');
            navigate('/account/'); // Redirect to profile page after cancellation
        } catch (error) {
            console.error('Error canceling trip:', error);
            if (error.response && error.response.status === 400) {
                alert('Trip dates overlap with another trip. Please choose different dates.');
            } else {
                alert('Failed to cancel the trip. Please try again.');
            }
        }
    };

    const handleMessages = () => {
        // Add your messages navigation logic here
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/reviews', {
                reviewedUserId: deal.user._id,
                tripId: deal._id,
                carId: deal.car._id,
                rating,
                comment,
                reviewerId: deal.car.owner._id
            });
            setReviewSubmitted(true);
        } catch (error) {
            console.error('Failed to submit review:', error);
        }
    };

    return (
        <div className="my-8">
            <div className="flex-row">
                <h1 className="text-3xl">{deal.car.title}</h1>
                <div className="w-96">
                    <CarImg car={deal.car} />
                </div>
            </div>
            <AddressLink className="my-2 block">{deal.car.address}</AddressLink>
            <div className="bg-gray-200 rounded-2xl">
                <div className="p-6 my-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl mb-4">Your deal information</h2>
                        <TripDates trip={deal} />
                    </div>
                    <div className="bg-primary p-6 text-white rounded-2xl">
                        <div>Total income</div>
                        <div className="text-3xl">${deal.price}</div>
                    </div>
                </div>
                <div>
                </div>
            </div>
            <div className="my-8">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/3 p-2">
                        <div className="bg-white p-4 rounded shadow-md">
                            <h2 className="text-2xl mb-2">Client Information</h2>
                            {deal.user.profilePicture && (
                                <img
                                    src={`http://localhost:4000${deal.user.profilePicture}`}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full mr-4"
                                />
                            )}
                            <p><strong>Name:</strong> {deal.user.name}</p>
                            <p><strong>Email:</strong> {deal.user.email}</p>
                            <p><strong>Phone:</strong> {deal.phone}</p>
                            <div className="mt-4">
                                <h3 className="font-semibold text-xl">Reviews</h3>
                                <ul className="list-disc list-inside">
                                    {deal.user.reviews.length > 0 ? (
                                        deal.user.reviews.map((review, index) => (
                                            <li key={index} className="text-sm text-gray-700 mt-1">
                                                <p><strong>{review.reviewedUser?.name}:</strong> {review.comment}</p>
                                                <p className="text-xs text-gray-500">Rating: {review.rating}</p>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-600">No reviews yet.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <button onClick={handleAcceptTrip} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                        Confirm Trip
                    </button>
                    <button onClick={handleCancelTrip} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                        Cancel Trip
                    </button>
                    <button onClick={handleMessages} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
                        Messages
                    </button>
                </div>
                {(deal.status === "confirmed" || deal.status === "completed") && (
                    <div className="mt-4 p-4 bg-white rounded shadow">
                        <h2 className="font-semibold text-2xl">Submit a Review</h2>
                        <p className="text-gray-700 mb-4">You are welcome to leave a review about the service during or after your trip.</p>
                        {!reviewSubmitted ? (
                            <form onSubmit={handleSubmitReview} className="mt-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">Rating</label>
                                    <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">Comment</label>
                                    <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4"></textarea>
                                </div>
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit Review</button>
                            </form>
                        ) : (
                            <p className="text-green-500 mt-4">Review submitted successfully!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
