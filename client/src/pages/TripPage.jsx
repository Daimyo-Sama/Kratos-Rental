import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddressLink from "../AddressLink";
import CarGallery from "../CarGallery";
import TripDates from "../TripDates";
import { UserContext } from "../UserContext";

// Load PayPal script
const loadPayPalScript = (clientId) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=CAD`;
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

export default function TripPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isPayPalScriptLoaded, setIsPayPalScriptLoaded] = useState(false);
  const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`/trips/${id}`).then((response) => {
        setTrip(response.data);
      });
    }

    // Load PayPal script
    loadPayPalScript(
      "AU3CK9Rvo6bUagdNuHdR0b2SBGT-wVKSB-Qf7vNggiFRPWdURKCkSB3Kds9PeNNyQXqDLB5myEbU_jbn"
    ).then(() => {
      setIsPayPalScriptLoaded(true);
    });
  }, [id]);

  if (!trip) return "Loading...";

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You need to be logged in to submit a review.");
      return;
    }
    try {
      await axios.post("/reviews", {
        reviewedUserId: trip.car.owner._id,
        tripId: trip._id,
        carId: trip.car._id,
        rating,
        comment,
        reviewerId: user._id,
      });
      setReviewSubmitted(true);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleCancelTrip = async () => {
    try {
      await axios.put(`/trips/${trip._id}/cancel`);
      alert("Trip canceled successfully!");
      navigate("/account/"); // Redirect to profile page after cancellation
    } catch (error) {
      console.error("Error canceling trip:", error);
      if (error.response && error.response.status === 400) {
        alert(
          "Trip dates overlap with another trip. Please choose different dates."
        );
      } else {
        alert("Failed to cancel the trip. Please try again.");
      }
    }
  };

  const handlePayment = async () => {
    if (!isPayPalScriptLoaded || paypalButtonsRendered) return;

    const createOrder = async () => {
      const amount = trip.price;
      const response = await axios.post("/create-paypal-order", { amount });
      return response.data.id;
    };

    const onApprove = async (data) => {
      const response = await axios.post("/capture-paypal-order", {
        orderID: data.orderID,
        tripID: trip._id,
      });
      if (response.data.message === "Payment successful and trip confirmed!") {
        alert("Payment successful and trip confirmed!");
        window.location.reload();
      } else {
        alert("Payment not completed");
      }
    };

    window.paypal
      .Buttons({
        createOrder: (data, actions) => createOrder(),
        onApprove: (data, actions) => onApprove(data),
      })
      .render(`#paypal-button-container`);

    setPaypalButtonsRendered(true);
  };

  return (
    <div className="my-8">
      <button
        onClick={() => navigate("/account/trips")}
        className="inline-flex items-center text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded mb-4 shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Go Back
      </button>
    
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
        <h2 className="text-2xl mb-4">Your trip information</h2>
        <h1 className="text-3xl">{trip.car.title}</h1>
        <AddressLink className="my-2 block">{trip.car.address}</AddressLink>
      
          
          <TripDates trip={trip} />
          
        </div>

        <div className="bg-gray-300 p-4 rounded shadow-md">
          <h2 className="text-2xl mb-2">Owner</h2>
          <div className="flex items-center">
            {trip.car.owner.profilePicture && (
              <img
                src={`http://localhost:4000${trip.car.owner.profilePicture}`}
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
            )}
            <div>
              <p>
                <strong>Name:</strong> {trip.car.owner.name}
              </p>
              <p>
                <strong>Email:</strong> {trip.car.owner.email}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="font-semibold">Status:</span> {trip.status}
        </div>
        <div className="text-center mt-4">
          <div id={`paypal-button-container`}></div>
          <button
            onClick={handlePayment}
            className={`btn-primary   ${
              trip.status !== "unpaid" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={trip.status !== "unpaid"}
          >
            Pay with PayPal
          </button>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleCancelTrip}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel Trip
          </button>
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${trip.price}</div>
        </div>
      </div>
      <CarGallery car={trip.car} />

      {(trip.status === "confirmed" || trip.status === "completed") && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="font-semibold text-2xl">Submit a Review</h2>
          <p className="text-gray-700 mb-4">
            You are welcome to leave a review about the service during or after
            your trip.
          </p>
          {!reviewSubmitted ? (
            <form onSubmit={handleSubmitReview} className="mt-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="rating"
                >
                  Rating
                </label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="comment"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <p className="text-green-500 mt-4">
              Review submitted successfully!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
