import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import CarGallery from "../CarGallery";
import TripDates from "../TripDates";

export default function TripPage() {
    const {id} = useParams();
    const [trip,setTrip] = useState(null);
    useEffect(() => {
        if(id) {
            axios.get('/trips').then(response => {
                const foundTrip = response.data.find(({_id}) => _id === id);
                if(foundTrip) {
                    setTrip(foundTrip);
                }
            });
        }
    }, [id]);

    if(!trip) {
        return '';
    }

    return (
        <div className="my-8">
            <h1 className="text-3xl">{trip.car.title}</h1>
            <AddressLink className="my-2 block">{trip.car.address}</AddressLink>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
                <div>
                    <h2 className="text-2xl mb-4">Your trip information</h2>
                    <TripDates trip={trip} />
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl">
                    <div>Total price</div>
                    <div className="text-3xl">${trip.price}</div>
                </div>
            </div>
            <CarGallery car={trip.car} />
        </div>
    );
}