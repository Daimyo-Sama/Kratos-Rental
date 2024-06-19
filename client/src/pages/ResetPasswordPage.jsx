import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get("token");

  async function handleResetPasswordSubmit(ev) {
    ev.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const { data } = await axios.post("/reset-password", { token, newPassword });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Reset Password</h1>
        <form className="max-w-md mx-auto" onSubmit={handleResetPasswordSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(ev) => setNewPassword(ev.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(ev) => setConfirmPassword(ev.target.value)}
          />
          <button className="primary">Reset Password</button>
        </form>
        {message && (
          <div className="text-center py-2 text-red-500">{message}</div>
        )}
      </div>
    </div>
  );
}
