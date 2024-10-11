import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";

function Signup() {
  const navigate = useNavigate();
  const { org } = useParams();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/signup/",
        { username, password, confirm_password: confirmPassword, organization_name: org },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      login(response.data.access, response.data.refresh, response.data.user);
      setSuccessMessage("User created successfully!");
      navigate("/appointments/uplift");
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data : error.message;
      setErrorMessage("Error creating user: " + JSON.stringify(errorMessage));
    }
  };

  return (
    <>
      <Box style={{ display: "flex", justifyContent: "center", marginBottom: "20px", width: "200px", margin: "auto" }}>
        <img src='/images/uplift4FINAL.jpg' alt='uplift logo' style={{ maxWidth: "100%", height: "auto" }} />
      </Box>
      <Card sx={{ maxWidth: 400, width: "100%", padding: 3 }}>
        <CardContent>
          <Typography variant='h5' component='div' align='center'>
            Signup
          </Typography>
          {errorMessage && (
            <Typography color='error' align='center'>
              {errorMessage}
            </Typography>
          )}
          {successMessage && (
            <Typography color='success.main' align='center'>
              {successMessage}
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
            <TextField
              label='Confirm Password'
              type='password'
              variant='outlined'
              fullWidth
              margin='normal'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type='submit' variant='contained' color='primary' fullWidth sx={{ marginTop: 2 }}>
              Signup
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default Signup;
