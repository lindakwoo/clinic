import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/login/`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      login(response.data.access, response.data.refresh, response.data.user);
      navigate("/appointments/uplift");
    } catch (error) {
      setErrorMessage("Error logging in: " + error.response.data.detail);
    }
  };

  return (
    <>
      <Box style={{ display: "flex", justifyContent: "center", marginBottom: "20px", width: "800px", margin: "auto" }}>
        <img src='/images/uplift4FINAL.jpg' alt='uplift logo' style={{ maxWidth: "100%", height: "auto" }} />
      </Box>
    </>
  );
}

export default Home;
