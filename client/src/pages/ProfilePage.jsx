import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import CarsPage from "./CarsPage";
import AccountNav from "../AccountNav";

const PayPalInstructions = () => (
    <div className="text-left">
        <h3 className="text-lg font-semibold mb-2">Create a PayPal Account</h3>
        <p>If you do not have a PayPal account, please <a href="https://www.paypal.com/signup" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">sign up here</a>.</p>
        <p>Once you have a PayPal account, please enter your PayPal email address below to link it to your profile and receive payments.</p>
    </div>
);

export default function ProfilePage() {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [bio, setBio] = useState(user?.bio || '');
    const [profilePicture, setProfilePicture] = useState(null);
    const [paypalEmail, setPaypalEmail] = useState(user?.paypalEmail || '');
    const [showPayPalInstructions, setShowPayPalInstructions] = useState(false);
    const [thankYouMessage, setThankYouMessage] = useState(false);

    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }

    async function updateBio(ev) {
        ev.preventDefault();
        try {
            const { data } = await axios.put('/profile/bio', { bio });
            setUser(data);
            alert('Bio updated successfully');
            await updateTaskStatus('Fill out bio');
        } catch (error) {
            alert('Failed to update bio');
        }
    }

    async function updateProfilePicture(ev) {
        ev.preventDefault();
        const formData = new FormData();
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const { data } = await axios.put('/profile/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUser(data);
            alert('Profile picture updated successfully');
            await updateTaskStatus('Upload Profile picture');
        } catch (error) {
            alert('Failed to update profile picture');
        }
    }

    async function updateTaskStatus(description) {
        const task = tasks.find(t => t.description === description);
        if (task) {
            try {
                const { data } = await axios.put(`/tasks/${task._id}`, { status: 'completed' });
                console.log('Task updated:', data); // Debug logging
                setTasks(prevTasks => prevTasks.map(t => t._id === task._id ? { ...t, status: 'completed' } : t));
            } catch (error) {
                console.error('Failed to update task status:', error);
            }
        }
    }

    useEffect(() => {
        if (ready && user) {
            axios.get('/tasks').then(({ data }) => {
                setTasks(data);
            });
        }
    }, [ready, user]);

    if (!ready) {
        return 'Loading...';
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    const handleBecomeOwner = async () => {
        try {
            await axios.post('/become-owner', { userId: user._id });
            setShowPayPalInstructions(true);
        } catch (error) {
            console.error('Error becoming owner:', error);
            alert('Failed to become an owner. Please try again.');
        }
    };

    const handleUpdatePayPalEmail = async (ev) => {
        ev.preventDefault();
        try {
            const { data } = await axios.post('/update-paypal-email', {
                userId: user._id,
                paypalEmail: paypalEmail
            });

            setUser(data.user);
            setTasks(data.tasks);
            setThankYouMessage(true);
        } catch (error) {
            console.error('Error updating PayPal email:', error);
            alert('Failed to update PayPal email. Please try again.');
        }
    };

    // Check if all tasks are completed
    const allTasksCompleted = tasks.every(task => task.status === 'completed');

    return (
        <div>
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
                    {user.name ? user.name : <span className="text-red-500">Name not available</span>}
                </h2>
                <p className="text-gray-600">
                    {user.bio ? user.bio : <span className="text-red-500">Bio not available</span>}
                </p>
            </div>
            <AccountNav />
            {subpage === 'profile' && (
                <div className="text-center max-w-xl mx-auto">
                    <form onSubmit={updateBio} className="space-y-4">
                        <div>
                            <label className="block text-left font-medium">Update Bio</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                placeholder="Tell us about yourself"
                                value={bio}
                                onChange={(ev) => setBio(ev.target.value)}
                            />
                        </div>
                        <button type="submit" className="primary">Update Bio</button>
                    </form>
                    <form onSubmit={updateProfilePicture} className="space-y-4 mt-4">
                        <div>
                            <label className="block text-left font-medium">Update Profile Picture</label>
                            <input
                                type="file"
                                className="w-full p-2 border rounded"
                                onChange={(ev) => setProfilePicture(ev.target.files[0])}
                            />
                        </div>  
                        <button type="submit" className="primary">Update Profile Picture</button>
                    </form>
                    <button onClick={logout} className="primary max-w-sm mt-4">Logout</button>
                    <div className="mt-4">
                        <h3 className="font-semibold text-xl">Tasks to Complete</h3>
                        <ul className="list-disc list-inside text-left">
                            {tasks.map((task, index) => (
                                <li key={index}>
                                    {task.description} - {task.status}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {user && user.role === 'owner' && (
                        <div className="mt-4">
                            <h3 className="font-semibold text-xl">Manage Your Cars</h3>
                            <CarsPage />
                        </div>
                    )}
                    {user && user.role !== 'owner' && (
                        <div className="mt-4 flex flex-col items-center">
                            {allTasksCompleted ? (
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold mb-2">All tasks are completed!</h3>
                                    <p>You can now access the host functionalities above.</p>
                                </div>
                            ) : showPayPalInstructions ? (
                                thankYouMessage ? (
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
                                        <p>Your PayPal email has been updated successfully. You can now receive payments.</p>
                                    </div>
                                ) : (
                                    <>
                                        <PayPalInstructions />
                                        <form onSubmit={handleUpdatePayPalEmail} className="mt-4">
                                            <label className="block text-left font-medium">PayPal Email</label>
                                            <input
                                                type="email"
                                                className="w-full p-2 border rounded"
                                                placeholder="Enter your PayPal email"
                                                value={paypalEmail}
                                                onChange={(ev) => setPaypalEmail(ev.target.value)}
                                                required
                                            />
                                            <button type="submit" className="primary mt-2">Submit</button>
                                        </form>
                                    </>
                                )
                            ) : (
                                <button onClick={handleBecomeOwner} className="primary mt-4">Become an Owner</button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
