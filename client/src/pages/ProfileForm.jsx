import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import CarsPage from "./CarsPage";
import AccountNav from "../AccountNav";
import ProfileForm from "../components/ProfileForm";

export default function ProfilePage() {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
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
                {user?.profilePicture ? (
                    <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full mx-auto mb-4" 
                    />
                ) : (
                    <p className="text-red-500">Profile picture not available</p>
                )}
                <h2 className="text-2xl font-semibold">
                    {user?.name ? user.name : <span className="text-red-500">Name not available</span>}
                </h2>
                <p className="text-gray-600">
                    {user?.bio ? user.bio : <span className="text-red-500">Bio not available</span>}
                </p>
            </div>
            <AccountNav />
            {subpage === 'profile' && (
                <div className="text-center max-w-xl mx-auto">
                    <ProfileForm />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {subpage === 'cars' && (
                <CarsPage />
            )}
        </div>
    );
}
