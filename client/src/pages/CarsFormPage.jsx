import axios from "axios";
import { useEffect, useState } from "react";
import Perks from "../Perks.jsx";
import PhotosUploader from "../PhotosUploader.jsx";
import AccountNav from "../AccountNav.jsx";
import { Navigate, useParams } from "react-router-dom";

export default function CarsFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/cars/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title || "");
      setAddress(data.address || "");
      setAddedPhotos(data.photos || []);
      setDescription(data.description || "");
      setPerks(data.perks || []);
      setExtraInfo(data.extraInfo || "");
      setCheckIn(data.checkIn || "");
      setCheckOut(data.checkOut || "");
      setMaxGuests(data.maxGuests || 1);
      setPrice(data.price || 100);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
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
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      await axios.put("/cars", {
        id,
        ...carData,
      });
      setRedirect(true);
    } else {
      await axios.post("/cars", carData);
      setRedirect(true);
    }
  }

  async function deleteCar() {
    try {
      await axios.delete(`/cars/${id}`);
      setRedirect(true);
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete the car. Please try again.");
    }
  }

  if (redirect) {
    return <Navigate to={"/account/cars"} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AccountNav />
      <form
        onSubmit={saveCar}
        className="p-6 bg-gray-300 border-8 border-gray-200 rounded-xl"
      >
        {preInput(
          "Title",
          "Title for your car, should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title, for example: My lovely car"
          className="w-full p-2 border rounded-lg mb-4"
        />
        {preInput("Address", "Address to this car")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="address"
          className="w-full p-2 border rounded-lg mb-4"
        />
        {preInput("Photos", "More = better")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput("Description", "Description of the car")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        />
        {preInput("Perks", "Select all the perks of your car")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-4">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput("Extra info", "Additional information, etc")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        />
        {preInput(
          "Price",
          "Add the income you want to receive per day. Remember that it will be more expensive for the user due to the Kratos fees"
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="11"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per day</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        <div className=" flex w-full justify-between space-x-12 mt-4">
          <button className="flex-1 primary my-4 px-4 py-2 text-white rounded-2xl hover:bg-green-800">
            Save
          </button>
          <button
            type="button"
            onClick={deleteCar}
            className="flex-1 my-4 px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-primary"
          >
            Delete Car
          </button>
        </div>
      </form>
    </div>
  );
}
