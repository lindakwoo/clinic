import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import styles for the phone input
import axios from "axios";

const StyledPhoneInput = styled(PhoneInput)({});

function PatientSignIn() {
  const [firstInitial, setFirstInitial] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [therapist, setTherapist] = useState("");

  const fetcchTherapists = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/therapists/");
      setTherapists(response.data.therapists);
    } catch (error) {
      console.error("There was an error fetching the therapists!", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/patients/", {
        first_initial: firstInitial,
        last_initial: lastInitial,
        phone_number: phoneNumber,
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
    <Container maxWidth='sm'>
      {!isSignedIn && therapists.length > 0 ? (
        <>
          <Typography variant='h4' gutterBottom>
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
              >
                {therapists.map((therapist) => (
                  <MenuItem key={therapist.id} value={therapist.id}>
                    {" "}
                    {therapist.first_name} {therapist.last_name}{" "}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </form>
        </>
      ) : !isSignedIn && therapists.length === 0 ? (
        <Typography>Loading therapis information...</Typography>
      ) : isSignedIn ? (
        <Typography variant='h4' gutterBottom>
          {" "}
          You have signed in and your therapist will contact you shortly.
        </Typography>
      ) : null}
    </Container>
  );
}

export default PatientSignIn;
