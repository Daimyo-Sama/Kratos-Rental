import { useEffect, useState } from "react";
import Perks from "../Perks.jsx";
import PhotosUploader from "../PhotosUploader.jsx";
import axios from "axios";
import AccountNav from "../AccountNav.jsx";
import { Navigate, useParams } from "react-router-dom";

export default function CarsFormPage() {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [price,setPrice] = useState(100);
    const [redirect,setRedirect] = useState(false);

    useEffect(() => {
        if(!id) {
            return;
        }
        axios.get('/cars/'+id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        });
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    
    function preInput(header,description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function saveCar(ev) {
        ev.preventDefault();
        const carData = {
            title, address, addedPhotos, 
            description, perks, extraInfo, 
            checkIn, checkOut, maxGuests, price,
        };
        if(id) {
            //update
            await axios.put('/cars', {
                id, ...carData
            });
            setRedirect(true);
        } else {
            //new car
            await axios.post('/cars', carData);
            setRedirect(true);
        }
    }

    if(redirect) {
        return <Navigate to={'/account/cars'} />
    }

    return (
        <div>
            <AccountNav />
            <form onSubmit={saveCar}>
                {preInput('Title', 'Title for your car, should be short and catchy as in advertisement')}
                <input type="text" 
                    value={title} 
                    onChange={ev =>setTitle(ev.target.value)} 
                    placeholder="title, for example: My lovely apt" />
                {preInput('Address', 'Address to this car')}
                <input type="text" 
                    value={address} 
                    onChange={ev =>setAddress(ev.target.value)} 
                    placeholder="address"/>
                {preInput('Photos', 'More = better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                {preInput('Description', 'Description of the car')}
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                {preInput('Perks', 'Select all the perks of your car')}
                <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks}/>
                </div>
                {preInput('Extra info', 'House rules, etc')}
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                {preInput('Check in&out times', 'Add check in and out times, remember to have some window for cleaning the room between guests')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input type="text" 
                            value={checkIn} 
                            onChange={ev => setCheckIn(ev.target.value)} 
                            placeholder="14" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                        <input type="text" 
                            value={checkOut} 
                            onChange={ev => setCheckOut(ev.target.value)} 
                            placeholder="11"/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guest</h3>
                        <input type="number" 
                            value={maxGuests} 
                            onChange={ev => setMaxGuests(ev.target.value)}/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" 
                            value={price} 
                            onChange={ev => setPrice(ev.target.value)}/>
                    </div>
                </div>
                <button className="primary my-4">Save</button>
            </form>
        </div>
    );
}