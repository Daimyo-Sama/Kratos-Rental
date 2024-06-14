import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TripWidget from "../TripWidget";
import CarGallery from "../CarGallery";
import AddressLink from "../AddressLink";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function CarPage() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/cars/${id}`).then(response => {
            setCar(response.data);
        });
    }, [id]);

    if (!car) return '';

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("You need to be logged in to submit a review.");
            return;
        }
        try {
            await axios.post('/reviews', {
                reviewedUserId: car.owner._id,
                tripId: id,
                carId: car._id,
                rating,
                comment,
                reviewerId: user._id // Assuming user._id is available
            });
            setReviewSubmitted(true);
        } catch (error) {
            console.error('Failed to submit review:', error);
        }
    };

    return (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
            <h1 className="text-3xl">{car.title}</h1>
            <AddressLink>{car.address}</AddressLink>
            <CarGallery car={car} />
            <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {car.description}
                    </div>
                    Check-in: {car.checkIn}<br />
                    Check-out: {car.checkOut}<br />
                    Max number of guests: {car.maxGuests}
                </div>
                <div>
                    <TripWidget car={car} />
                    {car.owner && (
                        <div className="mt-4 p-4 bg-white rounded shadow">
                            <h2 className="font-semibold text-2xl">Host Information</h2>
                            <div className="flex items-center mt-2">
                                {car.owner.profilePicture && (
                                    <img src={car.owner.profilePicture} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
                                )}
                                <div>
                                    <p className="text-lg font-semibold">{car.owner.name}</p>
                                    <p className="text-sm text-gray-600">{car.owner.bio}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold text-xl">Reviews</h3>
                                <ul className="list-disc list-inside">
                                    {car.owner.reviews.length > 0 ? (
                                        car.owner.reviews.map((review, index) => (
                                            <li key={index} className="text-sm text-gray-700 mt-1">{review.comment}</li>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-600">No reviews yet.</p>
                                    )}
                                </ul>
                            </div>
                            {!reviewSubmitted && (
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
                            )}
                            {reviewSubmitted && <p className="text-green-500 mt-4">Review submitted successfully!</p>}
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white -mx-8 px-8 py-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Extra info</h2>
                </div>
                <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{car.extraInfo}</div>
            </div>
        </div>
    );
}
