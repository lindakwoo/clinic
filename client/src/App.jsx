import React, { useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import "./App.css";
import PatientSignIn from "./components/PatientSignIn";
import SendMessage from "./components/SendMessage";
import Appointments from "./components/Appointments";
import Logout from "./components/Logout";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Therapists from "./components/Therapists";
import TherapistCreateForm from "./components/TherapistCreateForm";
import ProtectedRoute from "./protected-route";
import NavbarWrapper from "./components/navbar/NavbarWrapper";
import Home from "./components/Home";
import QrCodeGenerator from "./components/QrCodeGenerator";

function App() {
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const user = localStorage.getItem("user"); // Get the user as a string

    // Check if user exists before parsing
    if (accessToken && refreshToken && user) {
      try {
        const parsedUser = JSON.parse(user); // Only parse if user is not null or undefined
        login(accessToken, refreshToken, parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  }, [login]);

  return (
    <BrowserRouter>
      <NavbarWrapper />
      <main>
        <Box sx={{ mx: { xs: "0", lg: "64px" }, mt: { xs: "0", lg: "32px" } }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/patient_sign_in/:org' element={<PatientSignIn />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/signup/:org' element={<Signup />} />
            <Route path='/send_message/:id' element={<SendMessage />} />
            <Route path='/qr_code' element={<QrCodeGenerator />} />
            <Route
              path='/appointments/:org'
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path='/therapists/:org'
              element={
                <ProtectedRoute>
                  <Therapists />
                </ProtectedRoute>
              }
            />
            <Route
              path='/therapists/create'
              element={
                <ProtectedRoute>
                  <TherapistCreateForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </main>
    </BrowserRouter>
  );
}

export default App;
