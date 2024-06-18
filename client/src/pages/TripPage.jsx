import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AddressLink from "../AddressLink";
import CarGallery from "../CarGallery";
import TripDates from "../TripDates";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function TripPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (id) {
      axios.get(`/trips/${id}`).then((response) => {
        setTrip(response.data);
      });
    }
  }, [id]);

  if (!trip) return '';

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You need to be logged in to submit a review.");
      return;
    }
    try {
      await axios.post('/reviews', {
        reviewedUserId: trip.car.owner._id,
        tripId: trip._id,
        carId: trip.car._id,
        rating,
        comment,
        reviewerId: user._id
      });
      setReviewSubmitted(true);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <div className="my-8">
      <h1 className="text-3xl">{trip.car.title}</h1>
      <AddressLink className="my-2 block">{trip.car.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your trip information</h2>
          <TripDates trip={trip} />
        </div>
        <div className="mt-4 flex items-center">
          <span className="font-semibold">Status:</span> {trip.status}
          {trip.status === "confirmed" && (
            <Link to={`/account/trips/${trip._id}/details`} className="btn-primary ml-4">
              Go to New Page
            </Link>
          )}
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${trip.price}</div>
        </div>
      </div>
      <CarGallery car={trip.car} />
      {trip.status === "confirmed" && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="font-semibold text-2xl">Submit a Review</h2>
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
  );
}