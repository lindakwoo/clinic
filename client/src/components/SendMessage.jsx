import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";

const SendMessage = () => {
  // const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [message, setMessage] = useState("");
  const [patientId, setPatientId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";
  console.log(apiUrl);

  const fetchPatient = async () => {
    if (!patientId) {
      setError("Please enter a Patient ID.");
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/api/patients/${patientId}/`);

      console.log(response.data);
      setPatient(response.data);
    } catch (error) {
      console.error("There was an error fetching the patient!", error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }
    setIsSending(true);
    setError("");
    setSuccessMessage("");
    try {
      await axios.post(`${apiUrl}/api/twilio/send_message_to_patient/`, {
        phone_number: patient.phone_number,
        message: message,
      });
      setMessage("");
      setSuccessMessage("Message sent successfully!");
    } catch (error) {
      console.error("There was an error sending the message!", error);
      setError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // useEffect(() => {
  //   fetchPatient();
  // }, []);

  return (
    <Container sx={{ p: { xs: "0", lg: "16px" } }} maxWidth='sm'>
      <Box style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <img src='/images/uplift4FINAL.jpg' alt='uplift logo' style={{ maxWidth: "100%", height: "auto" }} />
      </Box>
      <Box mt={4} p={2} border={1} borderColor='grey.300' borderRadius={2}>
        {!patient ? (
          // Only show Patient ID input if patient is not fetched yet
          <>
            <Typography variant='h6' gutterBottom>
              Enter Patient ID to Send a Text Message.
            </Typography>
            <TextField
              label='Patient ID'
              type='number'
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              variant='outlined'
              size='small'
              sx={{ mb: 2 }}
            />
            <Button variant='contained' color='primary' onClick={fetchPatient} fullWidth>
              Fetch Patient
            </Button>
            {error && (
              <Typography color='error' variant='body2' sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </>
        ) : (
          // Once the patient is fetched, show the rest of the form
          <>
            <Typography variant='h6' gutterBottom>
              Send a Text Message to {patient.first_initial}.{patient.last_initial}.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant='outlined'
              value={message}
              placeholder='Example: "I am running late...be there in 10 minutes."'
              onChange={(e) => setMessage(e.target.value)}
              margin='normal'
            />
            {error && (
              <Typography color='error' variant='body2'>
                {error}
              </Typography>
            )}
            {successMessage && (
              <Typography color='success.main' variant='body2'>
                {successMessage}
              </Typography>
            )}
            <Button
              variant='contained'
              color='primary'
              disabled={isSending}
              onClick={handleSendMessage}
              sx={{ mt: 2 }}
              fullWidth
            >
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default SendMessage;
