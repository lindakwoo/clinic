import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import customFetch from "./fetchWrapper";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    console.log("refresh", refreshToken);
    try {
      const url = `${apiUrl}/logout/`;
      const data = { refresh_token: refreshToken };
      const options = { body: JSON.stringify(data), method: "POST" };
      const response = await customFetch(url, options);
      logout();
      alert("Logout successful!");
      navigate("/login");
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.detail || "Unknown error";
      alert(`Error logging out: ${errorMessage}`);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
