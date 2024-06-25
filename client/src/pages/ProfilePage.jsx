import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import CarsPage from "./CarsPage";
import AccountNav from "../AccountNav";

// Component for displaying PayPal instructions
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

  // Get the subpage from the URL
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  // Effect to fetch tasks when the component is ready and user is loaded
  useEffect(() => {
    if (ready && user) {
      // Fetch user tasks
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
  }, [ready, user]); // Dependencies to control re-running the effect

  // Function to update the user's bio
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

  // Function to update the user's profile picture
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

  // Function to update the status of a task
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

  // Function to handle the user becoming an owner
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

  // Function to update the user's PayPal email
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

  // Check if the PayPal task is completed
  const isPayPalTaskCompleted = tasks.some(
    (task) =>
      task.description === "Update PayPal Email" && task.status === "completed"
  );

  // Check if all tasks are completed
  const allTasksCompleted = tasks.every((task) => task.status === "completed");

  // Function to render task status icons
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

  // Handle loading and redirects
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
      <AccountNav paypalEmail={paypalEmail} />
<div className="bg-white p-6 rounded shadow-md text-center mb-4">
  {user.profilePicture ? (
    <img
      src={`http://localhost:4000${user.profilePicture}`} // Check for correct URL
      alt="Profile Image"
      className="w-32 h-32 rounded-full mx-auto mb-4  border-8 border-primary"
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
  <div className="bg-gray-200 text-white p-4 rounded mx-auto mt-4 max-w-lg">
    <p className="text-gray-600">
      {user.bio ? (
        user.bio
      ) : (
        <span className="text-red-500">Bio not available</span>
      )}
    </p>
    
  </div>
  <button
      onClick={() => setEditBio(true)}
      className="primary hover:bg-blue-700 mt-4"
      style={{ width: "300px" }}
    >
      Update Bio
    </button>
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
          {user && user.role !== "owner" && !isPayPalTaskCompleted && (
            <div className="mt-4 flex flex-col items-center">
              {!becomeOwnerClicked && (
                <button onClick={handleBecomeOwner} className="primary mt-4">
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
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
                  <p>
                    Your PayPal email has been updated successfully.
                    You are now set up to
                    receive payments and have gained access to the host functionalities!
                    <br></br>
                    <br></br>
                     You should now see My Cars and My Deals tabs at the top of the page.
                     Refer to about us page for more details.
                  </p>
                </div>
              )}
            </div>
          )}
          {allTasksCompleted && (
            <div className="bg-green-200 p-4 rounded mt-3">
              <h3 className="text-lg font-semibold mb-2">
                All tasks are complete!
              </h3>
              <h3 className="text-lg mb-2">
  If you are not sure how to use your account, please refer to our detailled instructions{" "}
  <Link to="/about-us" className="text-blue-500 underline hover:text-blue-700">
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
