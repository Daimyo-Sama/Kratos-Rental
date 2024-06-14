import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AddressLink from "../AddressLink";
import CarGallery from "../CarGallery";
import TripDates from "../TripDates";

export default function TripPage() {
  const { id } = useParams(); // Get the trip ID from the URL parameters
  const [trip, setTrip] = useState(null); // Initialize state to store trip details

  useEffect(() => {
    if (id) {
      // Fetch trip details only if the ID is present
      axios.get("/trips").then((response) => {
        const foundTrip = response.data.find(({ _id }) => _id === id);
        if (foundTrip) {
          setTrip(foundTrip); // Set the trip details in state
        }
      });
    }
  }, [id]); // Dependency array ensures this runs only when 'id' changes

  if (!trip) {
    return ""; // Return empty string if trip details are not yet loaded
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{trip.car.title}</h1>
      <AddressLink className="my-2 block">{trip.car.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your trip information</h2>
          <TripDates trip={trip} /> {/* Display trip dates */}
        </div>
        <div className="mt-4">
          <span className="font-semibold">Status:</span> {trip.status} {/* Display trip status */}
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${trip.price}</div> {/* Display trip price */}
        </div>
      </div>
      <CarGallery car={trip.car} /> {/* Display car gallery */}
      {trip.status === "confirmed" && ( // Conditionally render the button link if trip status is 'confirmed'
        <div className="text-center mt-4">
          <Link to={`/account/trips/${trip._id}/details`} className="btn-primary"> {/* Link to new page with trip ID */}
            Go to New Page
          </Link>
        </div>
      )}
    </div>
  );
}
