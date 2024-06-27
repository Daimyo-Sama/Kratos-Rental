import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ConfirmEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      axios
        .get(`http://localhost:4000/auth/confirm-email?token=${token}`)
        .then(() => {
          setMessage("Email confirmed successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        })
        .catch(() => {
          setMessage("Invalid token or token expired");
        });
    } else {
      setMessage("Invalid token");
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}
