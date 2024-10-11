import { useState } from "react";
import { TextField, Button, Container, Typography, styled, Box } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import styles for the phone input

import customFetch from "./fetchWrapper";
import { useNavigate } from "react-router-dom";

const StyledPhoneInput = styled(PhoneInput)({});

function TherapistCreateForm() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = "http://localhost:8000/api/therapists/create/";
      const data = { first_name: firstName, last_name: lastName, phone_number: phoneNumber };
      const options = { method: "POST", body: JSON.stringify(data) };
      const response = await customFetch(url, options);
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setIsCreated(true);
      navigate("/therapists/uplift");
    } catch (error) {
      console.error("There was an error creating the therapist!", error);
    }
  };

  return (
    <Container sx={{ p: { xs: "0", lg: "16px" } }} maxWidth='xs'>
      <Box style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <img src='/images/uplift4FINAL.jpg' alt='uplift logo' style={{ maxWidth: "100%", height: "auto" }} />
      </Box>
      {!isCreated ? (
        <>
          <Typography variant='h4' gutterBottom align='center'>
            Add a Therapist
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label='First Name'
              variant='outlined'
              fullWidth
              margin='normal'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label='Last Name'
              variant='outlined'
              fullWidth
              margin='normal'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  color: "#495057",
                  backgroundColor: "#fff",
                  transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                },
              }}
            />
            <Button type='submit' variant='contained' color='primary' fullWidth>
              Submit
            </Button>
          </form>
        </>
      ) : (
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
          <Typography variant='h5'>Therapist created successfully!</Typography>
        </Box>
      )}
    </Container>
  );
}

export default TherapistCreateForm;
