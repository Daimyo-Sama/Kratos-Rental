import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import CarsPage from "./CarsPage";
import AccountNav from "../AccountNav";

const PayPalInstructions = () => (
  <div className="text-left">
    <h3 className="text-lg font-semibold mb-2">Create a PayPal Account</h3>
    <p>
      If you do not have a PayPal account, please{" "}
      <a
        href="https://www.paypal.com/signup"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        sign up here
      </a>
      .
    </p>
    <p>
      Once you have a PayPal account, please enter your PayPal email address
      below to link it to your profile and receive payments.
    </p>
  </div>
);

export default function ProfilePage() {
  const [redirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [paypalEmail, setPaypalEmail] = useState(user?.paypalEmail || "");
  const [showPayPalInstructions, setShowPayPalInstructions] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState(false);
  const [editBio, setEditBio] = useState(false);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function updateBio(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.put("/profile/bio", { bio });
      setUser(data);
      alert("Bio updated successfully");
      await updateTaskStatus("Fill out bio");
    } catch (error) {
      alert("Failed to update bio");
    } finally {
      setEditBio(false);
    }
  }

  async function updateProfilePicture(ev) {
    ev.preventDefault();
    const formData = new FormData();
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const { data } = await axios.put("/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(data);
      alert("Profile picture updated successfully");
      await updateTaskStatus("Upload Profile picture");
    } catch (error) {
      alert("Failed to update profile picture");
    }
  }

  async function updateTaskStatus(description) {
    const task = tasks.find((t) => t.description === description);
    if (task) {
      try {
        const { data } = await axios.put(`/tasks/${task._id}`, {
          status: "completed",
        });
        console.log("Task updated:", data); // Debug logging
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t._id === task._id ? { ...t, status: "completed" } : t
          )
        );
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    }
  }

  useEffect(() => {
    if (ready && user) {
      axios.get("/tasks").then(({ data }) => {
        setTasks(data);
      });
    }
  }, [ready, user]);

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const handleBecomeOwner = async () => {
    try {
      await axios.post("/become-owner", { userId: user._id });
      setShowPayPalInstructions(true);
    } catch (error) {
      console.error("Error becoming owner:", error);
      alert("Failed to become an owner. Please try again.");
    }
  };

  const handleUpdatePayPalEmail = async (ev) => {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/update-paypal-email", {
        userId: user._id,
        paypalEmail: paypalEmail,
      });

      setUser(data.user);
      setTasks(data.tasks);
      setThankYouMessage(true);
    } catch (error) {
      console.error("Error updating PayPal email:", error);
      alert("Failed to update PayPal email. Please try again.");
    }
  };

  // Check if all tasks are completed
  const allTasksCompleted = tasks.every((task) => task.status === "completed");

  const renderTaskIcon = (status) => {
    if (status === "completed") {
      return (
        <svg
          className="w-6 h-6 mr-2 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      );
    } else {
      return (
        <svg
          className="w-6 h-6 mr-2 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      );
    }
  };

  return (
    <div>
      <AccountNav />
      <div className="bg-white p-6 rounded shadow-md text-center mb-4">
        {user.profilePicture ? (
          <img
            src={`http://localhost:4000${user.profilePicture}`} // Check for correct URL
            alt="Profile Image"
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
        ) : (
          <p className="text-red-500">Profile picture not available</p>
        )}
        <h2 className="text-2xl font-semibold">
          {user.name ? (
            user.name
          ) : (
            <span className="text-red-500">Name not available</span>
          )}
        </h2>
        <p className="text-gray-600">
          {user.bio ? (
            user.bio
          ) : (
            <span className="text-red-500">Bio not available</span>
          )}
          <br></br>
          <button
            onClick={() => setEditBio(true)}
            className="primary hover:bg-blue-700"
            style={{ width: "300px" }}
          >
            Update Bio
          </button>
        </p>
      </div>

      {subpage === "profile" && (
        <div className="text-center max-w-xl mx-auto">
          {editBio && (
            <form onSubmit={updateBio} className="space-y-4">
              <div>
                <label className="block text-left font-medium">
                  Enter your bio
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChange={(ev) => setBio(ev.target.value)}
                />
              </div>
              <button type="submit" className="primary hover:bg-blue-700">
                Confirm
              </button>
            </form>
          )}
          <div>
            <form onSubmit={updateProfilePicture} className="space-y-4 mt-4">
              <div className="p-4 border rounded shadow-lg bg-gray-50">
                <label className="block text-center font-medium mb-2 text- font-bold">
                  Update Profile Picture
                </label>
                <input
                  type="file"
                  className="w-50 p-10 border rounded mb-4 bg-white shadow-inner focus:ring-2 focus:primary"
                  onChange={(ev) => setProfilePicture(ev.target.files[0])}
                />
                <button
                  type="submit"
                  className="w-80 py-2 px-4 bg-blue-700 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                >
                  Update Profile Picture
                </button>
              </div>
            </form>
          </div>

          <div className="bg-blue-200 p-4 rounded mt-3">
            <h3 className="font-semibold text-xl">Tasks to Complete</h3>
            <ul className="list-disc list-inside text-left">
              {tasks.map((task, index) => (
                <li key={index} className="flex items-center">
                  {renderTaskIcon(task.status)}
                  {task.description} - {task.status}
                </li>
              ))}
            </ul>
            {user && user.role === "owner" && (
              <div className="mt-4">
                <h3 className="font-semibold text-xl">Manage Your Cars</h3>
                <CarsPage />
              </div>
            )}
          </div>
          {user && user.role !== "owner" && (
            <div className="mt-4 flex flex-col items-center">
              {allTasksCompleted ? (
                <div className="bg-green-400 p-4 rounded mt-3">
                  <h3 className="text-lg font-semibold mb-2">
                    All tasks are completed!
                  </h3>
                  <p>You can now access the host functionalities above.</p>
                </div>
              ) : showPayPalInstructions ? (
                thankYouMessage ? (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
                    <p>
                      Your PayPal email has been updated successfully. You can
                      now receive payments.
                    </p>
                  </div>
                ) : (
                  <>
                    <PayPalInstructions />
                    <form onSubmit={handleUpdatePayPalEmail} className="mt-4">
                      <label className="block text-left font-medium">
                        PayPal Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 border rounded"
                        placeholder="Enter your PayPal email"
                        value={paypalEmail}
                        onChange={(ev) => setPaypalEmail(ev.target.value)}
                        required
                      />
                      <button type="submit" className="primary mt-2">
                        Submit
                      </button>
                    </form>
                  </>
                )
              ) : (
                <button
                  onClick={handleBecomeOwner}
                  className="primary mt-4 hover:bg-blue-700 "
                >
                  Become an Owner
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
