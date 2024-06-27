import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AddressLink from "../AddressLink";
import TripDates from "../TripDates";
import CarImg from "../CarImg";

export default function DealPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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

  const handleAcceptDeal = async () => {
    try {
      await axios.put(`/deals/${deal._id}/accept`);
      alert("Deal accepted successfully!");
      navigate("/account/deals");
    } catch (error) {
      console.error("Error accepting deal:", error);
      alert("Failed to accept the deal. Please try again.");
    }
  };

  const handleCheckInDeal = async () => {
    try {
      await axios.put(`/deals/${deal._id}/checkin`);
      alert("Deal checked-in successfully!");
      navigate("/account/deals");
    } catch (error) {
      console.error("Error checking-in deal:", error);
      alert("Failed to check-in the deal. Please try again.");
    }
  };

  const handleCheckOutDeal = async () => {
    try {
      await axios.put(`/deals/${deal._id}/checkout`);
      alert("Deal checked-out successfully!");
      navigate("/account/deals");
    } catch (error) {
      console.error("Error checking-out deal:", error);
      alert("Failed to check-out the deal. Please try again.");
    }
  };

  const handleCancelDeal = async () => {
    try {
      await axios.put(`/deals/${deal._id}/cancel`);
      alert("Deal canceled successfully!");
      navigate("/account/deals");
    } catch (error) {
      console.error("Error canceling deal:", error);
      alert("Failed to cancel the deal. Please try again.");
    }
  };

  const handleArchiveDeal = async () => {
    try {
      await axios.put(`/deals/${deal._id}/archive`);
      alert("Deal archived successfully!");
      navigate("/account/deals");
    } catch (error) {
      console.error("Error archiving deal:", error);
      alert("Failed to archive the deal. Please try again.");
    }
  };

  const handleSubmitReview = async (ev) => {
    ev.preventDefault();
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

  function ownerMessage1() {
    if (deal.status === "upcoming") {
      return "New Booking Request!";
    }
    if (deal.status === "unpaid") {
      return "User Approved!";
    }
    if (deal.status === "confirmed") {
      return "Booking Completed!";
    }
    if (deal.status === "ongoing") {
      return "Trip in Progress!";
    }
    if (deal.status === "completed") {
      return "Trip Completed!";
    }
    if (deal.status === "cancelled") {
      return "Trip Canceled.";
    } else {
      return "";
    }
  }

  function ownerMessage2() {
    if (deal.status === "upcoming") {
      return "Approval needed.";
    }
    if (deal.status === "unpaid") {
      return "Awaiting Payment.";
    }
    if (deal.status === "confirmed") {
      return "Awaiting the Reservation!";
    }
    if (deal.status === "ongoing") {
      return "Everything is going OK!";
    }
    if (deal.status === "completed") {
      return "Thanks for Choosing Kratos!";
    }
    if (deal.status === "cancelled") {
      return "See you soon!";
    } else {
      return "";
    }
  }

  function ownerActionButton1() {
    const classNameButton = "w-1/2 py-1 bg-green-500 hover:bg-green-700 text-white font-bold rounded";
    if (deal.status === "upcoming") {
      const buttonText = "Approve";
      return (
        <button
          onClick={handleAcceptDeal}
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
          onClick={handleCheckInDeal}
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
          onClick={handleCheckOutDeal}
          className={classNameButton}
        >
          {buttonText}
        </button>
      );
    } else {
      return "";
    }
  }

  function ownerActionButton2() {
    const classNameButton = "w-1/2 py-1 ml-auto bg-red-500 hover:bg-red-700 text-white font-bold rounded";
    if (
      deal.status === "upcoming" ||
      deal.status === "unpaid" ||
      deal.status === "confirmed"
    ) {
      const buttonText = "Cancel";
      return (
        <button
          onClick={handleCancelDeal}
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
          onClick={handleArchiveDeal}
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
              <p>{ownerMessage1()}</p>
              <p>{ownerMessage2()}</p>
            </div>
            <div className="flex w-full p-2 space-x-2 mt-auto">
              {ownerActionButton1()}
              {ownerActionButton2()}
            </div>
          </div>
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
