import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { isValidPhoneNumber } from "react-phone-number-input";
import {
  TextField,
  Button,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  useTheme,
} from "@mui/material";
import "react-phone-number-input/style.css"; // Import styles for the phone input
import axios from "axios";

function PatientSignIn() {
  const theme = useTheme();
  const { org } = useParams();
  const [firstInitial, setFirstInitial] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [therapist, setTherapist] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";
  const fetcchTherapists = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/therapists/${org}`);
      setTherapists(response.data.therapists);
    } catch (error) {
      console.error("There was an error fetching the therapists!", error);
    }
  };

  const handlePhoneChange = (e) => {
    // Keep the value as-is for display purposes
    const inputValue = e.target.value.trim();
    setPhoneNumber(inputValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let rawNumber = phoneNumber.replace(/[^0-9]/g, ""); // Remove everything except digits
    if (phoneNumber.startsWith("+1") || phoneNumber.startsWith("1")) {
      rawNumber = rawNumber.substring(phoneNumber.startsWith("+1") ? 2 : 1); // Remove leading characters
    }
    const formattedNumber = `+1${rawNumber}`; // Prepend "+1"

    // Validate the phone number
    if (!isValidPhoneNumber(formattedNumber)) {
      setPhoneNumberError("Please enter a valid phone number. Example: 415 555 2671");
      return;
    } else {
      setPhoneNumberError("");
    }
    try {
      const response = await axios.post(`${apiUrl}/api/patients/`, {
        first_initial: firstInitial,
        last_initial: lastInitial,
        phone_number: formattedNumber,
        organization_name: org,
        therapist: therapist,
      });
      setFirstInitial("");
      setLastInitial("");
      setPhoneNumber("");
      setIsSignedIn(true);
    } catch (error) {
      console.error("There was an error creating the client!", error);
      setError("Failed to check in client");
    }
  };

  useEffect(() => {
    fetcchTherapists();
  }, []);

  return (
    <Container sx={{ p: { xs: "0", lg: "16px" } }} maxWidth='xs'>
      <Box style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <img src='/images/uplift4FINAL.jpg' alt='uplift logo' style={{ maxWidth: "100%", height: "auto" }} />
      </Box>
      {!isSignedIn && therapists.length > 0 ? (
        <>
          <Typography variant='h4' gutterBottom align='center'>
            Client Check In
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              label='First Initial'
              variant='outlined'
              fullWidth
              margin='normal'
              value={firstInitial}
              onChange={(e) => {
                if (e.target.value.length <= 1) setFirstInitial(e.target.value);
              }}
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
                color: theme.palette.text.primary,
              }}
            />
            <TextField
              required
              label='Last Initial'
              variant='outlined'
              fullWidth
              margin='normal'
              value={lastInitial}
              onChange={(e) => {
                if (e.target.value.length <= 1) setLastInitial(e.target.value);
              }}
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
                color: theme.palette.text.primary,
              }}
            />
            <TextField
              label='Phone Number'
              required
              variant='outlined'
              type='tel'
              fullWidth
              margin='normal'
              value={phoneNumber.replace("+1", "")} // Display without +1
              onChange={handlePhoneChange}
              placeholder='(999) 999-9999'
              sx={{
                backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
                color: theme.palette.text.primary,
              }}
            />

            {phoneNumberError && (
              <Typography color='error' variant='body2' sx={{ my: 1 }}>
                {phoneNumberError}
              </Typography>
            )}
            <FormControl sx={{ my: "16px" }} fullWidth>
              <InputLabel id='therapist'>Select Your Therapist</InputLabel>
              <Select
                labelId='therapist-label'
                value={therapist}
                required
                name='therapist'
                onChange={(e) => {
                  setTherapist(e.target.value);
                }}
                label='Select a Therapist'
                sx={{
                  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
                  color: theme.palette.text.primary,
                }}
              >
                {therapists.map((therapist) => (
                  <MenuItem key={therapist.id} value={therapist.id}>
                    {" "}
                    {therapist.first_name} {therapist.last_name}{" "}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type='submit' variant='contained' color='primary' fullWidth>
              Submit
            </Button>
          </form>
        </>
      ) : !isSignedIn && therapists.length === 0 ? (
        <Typography>Loading therapist information...</Typography>
      ) : isSignedIn ? (
        <Box
          sx={{
            backgroundColor: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
            padding: "16px",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <Typography variant='h5'>You are checked in!</Typography>
          <Typography variant='body1'>Please take a seat, your therapist will be with you shortly</Typography>
        </Box>
      ) : null}
      {error && (
        <Typography color='error' variant='body2' sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
}

export default PatientSignIn;
