import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import CarsPage from "./CarsPage";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
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

  async function updateBio(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.put('/profile/bio', { bio });
      setUser(data);
      alert('Bio updated successfully');
      updateTaskStatus('Fill out bio');
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
      updateTaskStatus('Upload Profile picture');
    } catch (error) {
      alert('Failed to update profile picture');
    }
  }

  async function updateTaskStatus(description) {
    const task = tasks.find(t => t.description === description);
    if (task) {
      try {
        await axios.put(`/tasks/${task._id}`, { status: 'completed' });
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

  const handleBecomeHost = async () => {
    try {
      await axios.post('/become-owner');
      setRedirect('/profile'); // Redirect to profile to show updated tasks
    } catch (error) {
      console.error('Error generating tasks:', error);
      alert('Failed to generate tasks. Please try again.');
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded shadow-md text-center mb-4">
        {user.profilePicture ? (
          <img 
            src={`http://localhost:4000${user.profilePicture}`} //vrm con une erreur dans un slash de trop
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
          {user.account_level === 'client' && (
            <button onClick={handleBecomeHost} className="primary max-w-sm mt-4">Want to become a host?</button>
          )}
        </div>
      )}
      {subpage === 'cars' && (
        <CarsPage />
      )}
    </div>
  );
}
