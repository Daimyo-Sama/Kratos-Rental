import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isPayPalScriptLoaded, setIsPayPalScriptLoaded] = useState(false);
  const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`/trips/${id}`).then((response) => {
        setTrip(response.data);
      });
    }
    loadPayPalScript(   // Load PayPal script
      "AU3CK9Rvo6bUagdNuHdR0b2SBGT-wVKSB-Qf7vNggiFRPWdURKCkSB3Kds9PeNNyQXqDLB5myEbU_jbn"
    ).then(() => {
      setIsPayPalScriptLoaded(true);
    });
  }, [id]);

  if (!trip) return "Loading...";

    const handlePayment = async () => {
    if (!isPayPalScriptLoaded) {
      console.error("Error : Paypal script not loaded.");
      return "";
    }
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
      fundingSource: window.paypal.FUNDING.PAYPAL,
    })
    .render(`#paypal-button-container`);
    setPaypalButtonsRendered(true);
  };

  const handleCancelTrip = async () => {
    try {
      await axios.put(`/trips/${trip._id}/cancel`);
      alert("Trip canceled successfully!");
      navigate("/account/trips");
    } catch (error) {
      console.error("Error canceling trip:", error);
      alert("Failed to cancel the trip. Please try again.");
    }
  };

  const handleArchiveTrip = async () => {
    try {
      await axios.put(`/trips/${trip._id}/archive`);
      alert("Trip archived successfully!");
      navigate("/account/trips");
    } catch (error) {
      console.error("Error archiving trip:", error);
      alert("Failed to archive the trip. Please try again.");
    }
  };

  const handleSubmitReview = async (ev) => {
    ev.preventDefault();
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

  function userMessage1() {
    if (trip.status === "upcoming") {
      return "Booking Request Completed!";
    }
    if (trip.status === "unpaid") {
      return "Your Request Approved!";
    }
    if (trip.status === "confirmed") {
      return "Booking Completed!";
    }
    if (trip.status === "ongoing") {
      return "Trip in Progress!";
    }
    if (trip.status === "completed") {
      return "Trip Completed!";
    }
    if (trip.status === "cancelled") {
      return "Trip Canceled.";
    } else {
      return "";
    }
  }

  function userMessage2() {
    if (trip.status === "upcoming") {
      return "Awaiting Approval.";
    }
    if (trip.status === "unpaid") {
      return "Payment Required.";
    }
    if (trip.status === "confirmed") {
      return "Awaiting Your Reservation!";
    }
    if (trip.status === "ongoing") {
      return "Enjoy Your Trip!";
    }
    if (trip.status === "completed") {
      return "Thanks for Choosing Kratos!";
    }
    if (trip.status === "cancelled") {
      return "See you soon!";
    } else {
      return "";
    }
  }

  function userActionButton1() {
    const classNameButton = "w-full py-1 bg-green-500 hover:bg-green-700 text-white font-bold rounded";
    if (trip.status === "unpaid") {
      const buttonText = "Payment";
      return (
        <div className="w-1/2">
          <div id={`paypal-button-container`}></div>
          {!paypalButtonsRendered && (
            <button
              onClick={handlePayment}
              className={classNameButton}
            >
              {buttonText}
            </button>
          )}
        </div>
      );
    } else {
      return "";
    }
  }

  function userActionButton2() {
    const classNameButton = "w-full py-1 bg-red-500 hover:bg-red-700 text-white font-bold rounded";
    if (
      trip.status === "upcoming" ||
      trip.status === "unpaid" ||
      trip.status === "confirmed"
    ) {
      const buttonText = "Cancel";
      return (
        <div className="w-1/2 ml-auto">
          {!paypalButtonsRendered && (
            <button
              onClick={handleCancelTrip}
              className={classNameButton}
            >
              {buttonText}
            </button>
          )}
        </div>
      );
    }
    if (trip.status === "completed" || trip.status === "cancelled") {
      const buttonText = "Archive";
      return (
        <div className="w-1/2 ml-auto">
          <button onClick={handleArchiveTrip} 
          className={classNameButton}
          >
            {buttonText}
          </button>
        </div>
      );
    } else {
      return "";
    }
  }

  return (
    <div className="my-8 max-w-6xl mx-auto">
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
      <div className="bg-gray-200 rounded-2xl">
        <div className="p-6 my-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl">{trip.car.title}</h1>
            <AddressLink className="my-2 block">{trip.car.address}</AddressLink>
          </div>
          <div>
            <h2 className="text-2xl mb-4">Your trip information</h2>
            <TripDates trip={trip} />
            <div className="text-center mt-4">
              <Link
                to="/about-us"
                className="text-blue-500 underline hover:text-blue-700"
              >
                Confused? Check out our user guide!
              </Link>
            </div>
          </div>
          <div className="flex flex-col px-2 bg-gray-200 w-64 items-center py-2 justify-between ">
            <h3 className="text-lg font-semibold">Message</h3>
            <div className="flex flex-col items-center space-y-2 py-2">
              <p>{userMessage1()}</p>
              <p>{userMessage2()}</p>
            </div>
            <div className="flex w-full p-2 space-x-2">
              {userActionButton1()}
              {userActionButton2()}
            </div>
          </div>
          <div className="bg-primary p-6 text-white rounded-2xl">
            <div>Total price</div>
            <div className="text-3xl">${trip.price}</div>
          </div>
        </div>
      </div>
      <div className="bg-gray-300 p-4 mb-1 rounded shadow-md">
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
        <div className="mt-2">
          <CarGallery car={trip.car} />
        </div>
      </div>

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
