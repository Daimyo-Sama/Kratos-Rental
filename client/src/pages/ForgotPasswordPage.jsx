import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleForgotPasswordSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/forgot-password", { email });
      setMessage(data.message);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage("User not found.");
      } else {
        setMessage("Failed to send reset link. Please try again.");
      }
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Forgot Password</h1>
        <form className="max-w-md mx-auto" onSubmit={handleForgotPasswordSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <button className="primary">Send Reset Link</button>
        </form>
        {message && (
          <div className="text-center py-2 text-red-500">{message}</div>
        )}
      </div>
    </div>
  );
}
