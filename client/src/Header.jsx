import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  async function handleLogout() {
    try {
      await axios.post("/logout");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }

  return (
    <header className="flex justify-between items-center">
      <Link to={"/"} className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>
        <span className="font-bold text-xl">Kratos</span>
      </Link>
      <div className="flex gap-2 border border-gray-300 rounded-full p-2 px-4 shadow-md shadow-gray-300">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city, zip code or address"
          className="flex-grow outline-none"
        />
        <div className="border-l border-gray-300"></div>
        <div>Any week</div>
        <div className="border-l border-gray-300"></div>
        <div>Add guests</div>
        <button className="bg-primary text-white p-1 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
      <div className="relative group">
        <Link
          to={user ? "/account" : "/login"}
          className="text-white flex items-center gap-2 hover:bg-blue-700 bg-primary border-primary rounded-full p-2 px-4"
        >
          <div className="bg-white rounded-full border border-primary overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-primary w-6 h-6 relative top-1"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {!!user && <div>{user.name}</div>}
        </Link>
        {user && (
          <button
            onClick={handleLogout}
            className=" px-1 bg-opacity-0 rounded-full hover:bg-blue-700 mt-1 ml-5 "
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
