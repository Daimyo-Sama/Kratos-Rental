import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import PropTypes from 'prop-types';

export default function TripWidget({car}) {
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [numberOfGuests,setNumberOfGuests] = useState(1);
    const [name,setName] = useState('');
    const [phone,setPhone] = useState('');
    const [redirect,setRedirect] = useState('');
    const {user} = useContext(UserContext);

    useEffect(() => {
        if(user) {
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0;
    if(checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }
    // if (!checkIn || !checkOut || !numberOfGuests || !name || !phone) {
    //     alert("All fields are required!");
    //     return;
    // }

    //include in try catch block 
    //console.error('Error creating booking:', error);
   //alert('Failed to book the place. Please try again.');

   async function bookThisCar() {
    if (!checkIn || !checkOut || !numberOfGuests || !name || !phone) {
        alert("All fields are required!");
        return;
    }

    try {
        const response = await axios.post('/trips', {
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            car: car._id,
            price: numberOfNights * car.price,
        });
        // Redirect
        const tripId = response.data._id;
        setRedirect(`/account/trips/${tripId}`);
    } catch (error) {
        if (error.response && error.response.status === 400) {
            alert('This car is already booked for the selected dates.');
        } else {
            console.error('Error creating booking:', error);
            alert('Failed to book the car. Please try again.');
        }
    }
}
    if(redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${car.price} per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4">
                        <label>Check in:</label>
                        <input type="date" 
                            value={checkIn} 
                            onChange={ev => setCheckIn(ev.target.value)} />
                    </div>
                    <div className="py-3 px-4 border-l">
                        <label>Check out:</label>
                        <input type="date" value={checkOut} 
                            onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                </div>
                <div className="py-3 px-4 border-t">
                    <label>Number of guests:</label>
                    <input type="number" 
                        value={numberOfGuests} 
                        onChange={ev => setNumberOfGuests(ev.target.value)} />
                </div>
                {numberOfNights > 0 && (
                    <div className="py-3 px-4 border-t">
                        <label>Your full name:</label>
                        <input type="text" 
                            value={name} 
                            onChange={ev => setName(ev.target.value)} />
                        <label>Phone number:</label>
                        <input type="tel" 
                            value={phone} 
                            onChange={ev => setPhone(ev.target.value)} />
                    </div>
                )}
            </div>
            <button onClick={bookThisCar} className="primary mt-4">
                Book this car 
                {numberOfNights > 0 && (
                    <span> ${numberOfNights * car.price}</span>
                )}
            </button>
        </div>
    );
}

TripWidget.propTypes = {
    car: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired
    }).isRequired
};