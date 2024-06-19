import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import TripDates from "../TripDates";
import CarImg from "../CarImg";
import StatusNav from "../StatusNav";

export default function DealPage() {
    const {id} = useParams();
    const [deal,setDeal] = useState(null);
    useEffect(() => {
        if(id) {
            axios.get('/deals').then(response => {
                const foundDeal = response.data.find(({_id}) => _id === id);
                if(foundDeal) {
                    setDeal(foundDeal);
                }
            });
        }
    }, [id]);

    if(!deal) {
        return '';
    }

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
                    <StatusNav trip={deal.status}/>
                </div>
            </div>
            <div>
                USER INFOS
            </div>
        </div>
    );
}