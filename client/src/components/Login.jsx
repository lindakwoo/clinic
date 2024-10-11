import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function Login() {
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
      <Box style={{ display: "flex", justifyContent: "center", marginBottom: "20px", width: "200px", margin: "auto" }}>
        <img src='/images/uplift4FINAL.jpg' alt='uplift logo' style={{ maxWidth: "100%", height: "auto" }} />
      </Box>
      <Card sx={{ maxWidth: 400, width: "100%", padding: 3, backgroundColor: "white" }}>
        <CardContent>
          <Typography variant='h5' component='div' align='center'>
            Login
          </Typography>
          {errorMessage && (
            <Typography color='error' align='center'>
              {errorMessage}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label='Username'
              variant='outlined'
              fullWidth
              margin='normal'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label='Password'
              type='password'
              variant='outlined'
              fullWidth
              margin='normal'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' variant='contained' color='primary' fullWidth sx={{ marginTop: 2 }}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default Login;
