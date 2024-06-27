import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
    return "Loading...";
  }

  const handleAcceptTrip = async () => {
    try {
      const response = await axios.put(`/trips/${deal._id}/accept`);
      setDeal(response.data);
      alert("Trip accepted successfully!");
    } catch (error) {
      console.error("Error accepting trip:", error);
      alert("Failed to accept the trip. Please try again.");
    }
  };

  const handleCancelTrip = async () => {
    try {
      const response = await axios.put(`/trips/${deal._id}/cancel`);
      setDeal(response.data);
      alert("Trip canceled successfully!");
      navigate("/account/");
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/reviews", {
        reviewedUserId: deal.user._id,
        tripId: deal._id,
        carId: deal.car._id,
        rating,
        comment,
        reviewerId: deal.car.owner._id,
      });
      setReviewSubmitted(true);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  function ownerAccessPanelMessage1(dealStatus) {
    if (dealStatus === "upcoming") {
      return "New Booking Request!";
    }
    if (dealStatus === "unpaid") {
      return "User Approved!";
    }
    if (dealStatus === "confirmed") {
      return "Booking Completed!";
    }
    if (dealStatus === "ongoing") {
      return "Trip in Progress!";
    }
    if (dealStatus === "completed") {
      return "Trip Completed!";
    }
    if (dealStatus === "cancelled") {
      return "Trip Canceled.";
    } else {
      return "";
    }
  }

  function ownerAccessPanelMessage2(dealStatus) {
    if (dealStatus === "upcoming") {
      return "Approval needed.";
    }
    if (dealStatus === "unpaid") {
      return "Awaiting Payment.";
    }
    if (dealStatus === "confirmed") {
      return "Awaiting the Reservation!";
    }
    if (dealStatus === "ongoing") {
      return "Everything is going OK!";
    }
    if (dealStatus === "completed") {
      return "Thanks for Choosing Kratos!";
    }
    if (dealStatus === "cancelled") {
      return "See you soon!";
    } else {
      return "";
    }
  }

  function ownerActionButton1(deal) {
    const classNameButton =
      "w-1/2 py-1 bg-green-500 hover:bg-green-700 text-white font-bold rounded";
    if (deal.status === "upcoming") {
      const buttonText = "Approve";
      return (
        <button
          onClick={(ev) => handleAcceptDeal(ev, deal._id)}
          className={classNameButton}
        >
          {buttonText}
        </button>
      );
    }
    if (deal.status === "confirmed") {
      const buttonText = "Check-In";
      return (
        <button
          onClick={(ev) => handleCheckInDeal(ev, deal._id)}
          className={classNameButton}
        >
          {buttonText}
        </button>
      );
    }
    if (deal.status === "ongoing") {
      const buttonText = "Check-Out";
      return (
        <button
          onClick={(ev) => handleCheckOutDeal(ev, deal._id)}
          className={classNameButton}
        >
          {buttonText}
        </button>
      );
    }
    if (deal.status === "completed") {
      const buttonText = "Review";
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
    const classNameButton =
      "w-1/2 py-1 ml-auto bg-red-500 hover:bg-red-700 text-white font-bold rounded";
    if (
      deal.status === "upcoming" ||
      deal.status === "unpaid" ||
      deal.status === "confirmed"
    ) {
      const buttonText = "Cancel";
      return (
        <button
          onClick={() => handleCancelDeal(deal._id)}
          className={classNameButton}
        >
          {buttonText}
        </button>
      );
    }
    if (deal.status === "completed" || deal.status === "cancelled") {
      const buttonText = "Archive";
      return (
        <button
          onClick={(ev) => handleArchiveDeal(ev, deal._id)}
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
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate("/account/deals")}
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

      <div className="w-96 m-1 border-4 border-gray-300">
        <CarImg car={deal.car} />
      </div>

      <div className="bg-gray-200 rounded-2xl">
        <div className="p-6 my-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl">{deal.car.title}</h1>
            <AddressLink className="my-2 block">{deal.car.address}</AddressLink>
          </div>
          <div>
            <h2 className="text-2xl mb-4">Your deal information</h2>
            <TripDates trip={deal} />
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
            <div className="flex flex-col items-center space-y-2 pt-2">
              <p>{ownerAccessPanelMessage1(deal.status)}</p>
              <p>{ownerAccessPanelMessage2(deal.status)}</p>
            </div>
            <div className="flex w-full p-2 space-x-2 mt-auto">
              {ownerActionButton1(deal)}
              {ownerActionButton2(deal)}
            </div>
          </div>

          {/* <div className="flex flex-wrap">
            <button
              onClick={handleAcceptTrip}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Confirm Trip
            </button>
            <button
              onClick={handleCancelTrip}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Cancel Trip
            </button>
          </div> */}
          <div className="bg-primary p-6 text-white rounded-2xl">
            <div>Total income</div>
            <div className="text-3xl">${deal.price}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap mt-8">
        <div className="w-full md:w-1/2 p-2">
          <div className="bg-white border-2 border-gray-200 p-4 rounded shadow-md">
            <div>
              <h2 className="text-2xl mb-4">Client Information</h2>
              {deal.user?.profilePicture && (
                <img
                  src={`http://localhost:4000${deal.user.profilePicture}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4 border-gray-400 border-4"
                />
              )}
              <p>
                <strong>Name:</strong> {deal.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {deal.user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {deal.phone}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-xl">Reviews</h3>
              <div>
                {deal.user?.reviews?.length > 0 ? (
                  deal.user.reviews.map((review, index) => (
                    <div key={index} className="text-sm text-gray-700 mt-1">
                      <p>
                        <strong>
                          {review.reviewer ? review.reviewer.name : "Anonymous"}
                          :
                        </strong>{" "}
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-500">
                        Rating: {review.rating}
                      </p>
                      {index < deal.user.reviews.length - 1 && (
                        <hr className="my-4 border-gray-300" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-2">
          {(deal.status === "confirmed" || deal.status === "completed") && (
            <div className="p-4 w-full bg-gray-200 rounded shadow">
              <h2 className="font-semibold text-2xl">Submit a Review</h2>
              <p className="text-gray-700 mb-4">
                You are welcome to leave a review about the client during or
                after your trip.
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
      </div>
    </div>
  );
}
