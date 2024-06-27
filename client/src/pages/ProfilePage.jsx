import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams, Link } from "react-router-dom";
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
  const [becomeOwnerClicked, setBecomeOwnerClicked] = useState(false);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  useEffect(() => {
    if (ready && user) {
      axios.get("/tasks").then(({ data }) => {
        setTasks(data);
        if (
          data.some(
            (task) =>
              task.description === "Update PayPal Email" &&
              task.status === "completed"
          )
        ) {
          setThankYouMessage(true);
        }
      });
    }
  }, [ready, user]);

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
        console.log("Task updated:", data);
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

  const handleBecomeOwner = async () => {
    try {
      await axios.post("/become-owner", { userId: user._id });
      setShowPayPalInstructions(true);
      setBecomeOwnerClicked(true);
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

  const isPayPalTaskCompleted = tasks.some(
    (task) =>
      task.description === "Update PayPal Email" && task.status === "completed"
  );

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

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      {/* On passe ce prop au component */}
      <AccountNav paypalEmail={paypalEmail} />
      <div className="bg-gray-200 p-6 rounded shadow-lg shadow-inner border-2 border-white text-center mb-4 max-w-xl mx-auto">
        {user.profilePicture ? (
          <img
            src={`http://localhost:4000${user.profilePicture}`}
            alt="Profile Image"
            className="w-32 h-32 rounded-full mx-auto mb-4  border-8 border-primary"
          />
        ) : (
          <p className="text-red-500">Profile picture not available</p>
        )}
        <h2 className="bg-white-200 w-1/2 rounded-md text-2xl font-semibold mx-auto">
          {user.name ? (
            user.name
          ) : (
            <span className="text-red-500">Name not available</span>
          )}
        </h2>
        <div className="bg-gray-300 text-white p-4 rounded mx-auto mt-4 max-w-lg border-4 border-primary">
          <p className="text-gray-600 font-semibold">
            {user.bio ? (
              user.bio
            ) : (
              <span className="text-red-500">Bio not available</span>
            )}
          </p>
        </div>
        <button
          onClick={() => setEditBio(true)}
          className="primary hover:bg-blue-700 max-w-48 mt-2"
        >
          Update Bio
        </button>
      </div>

      {subpage === "profile" && (
        <div className="text-center  max-w-xl mx-auto">
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

          <div className="bg-blue-200 p-4 shadow-inner rounded mt-3">
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
          {user && user.role !== "owner" && !isPayPalTaskCompleted && (
            <div className="mt-4 flex flex-col items-center">
              {!becomeOwnerClicked && (
                <button
                  onClick={handleBecomeOwner}
                  className=" primary max-w-48 hover:bg-blue-700 "
                >
                  Become an Owner
                </button>
              )}
              {showPayPalInstructions && !thankYouMessage && (
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
              )}
              {thankYouMessage && (
                <div className=" bg-red-200 shadow-inner text-center ">
                  <h3 className="text-lg font-semibold mt-4 ">Thank You!</h3>
                  <p className="mb-4">
                    Your PayPal email has been updated successfully. You are now
                    set up to receive payments and have gained access to the
                    host functionalities!
                    <br></br>
                    <br></br>
                    <b>
                      You should now see My Cars and My Deals tabs at the top of
                      the page.
                    </b>
                  </p>
                </div>
              )}
            </div>
          )}
          {allTasksCompleted && (
            <div className="bg-green-200 p-4 shadow-inner rounded mt-3">
              <h3 className="text-lg font-semibold mb-2">
                All tasks are complete!
              </h3>
              <h3 className="text-lg mb-2">
                If you are not sure how to use your account, please refer to our
                detailled instructions{" "}
                <Link
                  to="/about-us"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  here
                </Link>
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
