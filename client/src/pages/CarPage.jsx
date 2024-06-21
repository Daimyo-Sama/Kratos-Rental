import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, } from "react-router-dom";
import TripWidget from "../TripWidget";
import CarGallery from "../CarGallery";
import AddressLink from "../AddressLink";

export default function CarPage() {
    const { id } = useParams();
    const [car, setCar] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/cars/${id}`).then(response => {
            setCar(response.data);
        });
    }, [id]);

    if (!car) return 'Loading...';

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
                     <div className="bg-grey -mx-2 px-2 py-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Extra info</h2>
                </div>
                <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{car.extraInfo}</div>
            </div>
                </div>
                <div>
                    <TripWidget car={car} />
                    {car.owner && (
                        <div className="mt-4 p-4 bg-white rounded shadow">
                            <h2 className="font-semibold text-2xl">Host Information</h2>
                            <div className="flex items-center mt-2">
                                {car.owner.profilePicture && (
                                    <img 
                                        src={`http://localhost:4000${car.owner.profilePicture}`} 
                                        alt="Profile" 
                                        className="w-16 h-16 rounded-full mr-4" 
                                    />
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
                                            <li key={index} className="text-sm text-gray-700 mt-1">
                                                <p><strong>{review.reviewedUser.name}:</strong> {review.comment}</p>
                                                <p className="text-xs text-gray-500">Rating: {review.rating}</p>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-600">No reviews yet.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                   
                </div>
            </div>
           
        </div>
    );
}
