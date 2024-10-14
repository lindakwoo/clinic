import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  styled,
  Box,
  useTheme,
} from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import styles for the phone input
import axios from "axios";

const StyledPhoneInput = styled(PhoneInput)({});

function PatientSignIn() {
  const theme = useTheme();
  const { org } = useParams();
  const [firstInitial, setFirstInitial] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [therapist, setTherapist] = useState("");

  const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";
  const fetcchTherapists = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/therapists/${org}`);
      setTherapists(response.data.therapists);
    } catch (error) {
      console.error("There was an error fetching the therapists!", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Phone number type:", typeof phoneNumber);
      const response = await axios.post(`${apiUrl}/api/patients/`, {
        first_initial: firstInitial,
        last_initial: lastInitial,
        phone_number: phoneNumber,
        organization_name: org,
        therapist: therapist,
      });
      console.log("Patient created:", response.data);
      setFirstInitial("");
      setLastInitial("");
      setPhoneNumber("");
      setIsSignedIn(true);
    } catch (error) {
      console.error("There was an error creating the patient!", error);
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
            Patient Sign In
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
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
            <StyledPhoneInput
              international
              defaultCountry='US'
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder='Enter phone number'
              sx={{
                width: "100%",
                margin: "16px 0",
                height: "56px",
                "& input": {
                  height: "50px",
                  borderRadius: "4px",
                  border: "1px solid #ced4da",
                  //   padding: "0.375rem 0.75rem",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  color: "#495057",
                  backgroundColor: "#fff",
                  backgroundClip: "padding-box",
                  transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                },
              }}
            />
            <FormControl sx={{ mb: "16px" }} fullWidth>
              <InputLabel id='therapist'>Select a Therapist</InputLabel>
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
          <Typography variant='h5'>You have signed in successfully!</Typography>
          <Typography variant='body1'>Your therapist will contact you shortly.</Typography>
        </Box>
      ) : null}
    </Container>
  );
}

export default PatientSignIn;
