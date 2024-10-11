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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/login/",
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        <img
          src='/images/uplift4FINAL.jpg' // Path to your Uplift logo
          alt='Uplift Logo'
          style={{ width: "150px", height: "auto" }}
        />
      </Box>
      <Card sx={{ maxWidth: 400, width: "100%", padding: 3 }}>
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
    </Box>
  );
}

export default Login;
