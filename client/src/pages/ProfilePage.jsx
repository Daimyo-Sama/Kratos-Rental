import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import CarsPage from "./CarsPage";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);
    let { subpage } = useParams();
    const [bio, setBio] = useState(user?.bio || '');
    const [profilePicture, setProfilePicture] = useState(null);

    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
    }

    async function updateProfile(ev) {
        ev.preventDefault();
        const formData = new FormData();
        formData.append('bio', bio);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const { data } = await axios.put('/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUser(data);
            alert('Profile updated successfully');
        } catch (error) {
            alert('Failed to update profile');
        }
    }

    if (!ready) {
        return 'Loading...';
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div>
            <div className="bg-white p-6 rounded shadow-md text-center mb-4">
                {user.profilePicture ? (
                    <img 
                        src={user.profilePicture} 
                        alt="Profile" 
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
                    <form onSubmit={updateProfile} className="space-y-4">
                        <div>
                            <label className="block text-left font-medium">Update Bio</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                placeholder="Tell us about yourself"
                                value={bio}
                                onChange={(ev) => setBio(ev.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-left font-medium">Update Profile Picture</label>
                            <input
                                type="file"
                                className="w-full p-2 border rounded"
                                onChange={(ev) => setProfilePicture(ev.target.files[0])}
                            />
                        </div>
                        <button type="submit" className="primary">Update Profile</button>
                    </form>
                    <button onClick={logout} className="primary max-w-sm mt-4">Logout</button>
                </div>
            )}
            {subpage === 'cars' && (
                <CarsPage />
            )}
        </div>
    );
}
