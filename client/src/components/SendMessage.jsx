import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";

const SendMessage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const fetchPatient = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/patients/${id}/`);
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
    try {
      await axios.post("http://localhost:8000/api/twilio/send_message_to_patient/", {
        phone_number: patient.phone_number,
        message: message,
      });
      setMessage("");
      alert("Message sent successfully!");
    } catch (error) {
      console.error("There was an error sending the message!", error);
      setError("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, []);

  return (
    <Container maxWidth='sm'>
      <Box mt={4} p={2} border={1} borderColor='grey.300' borderRadius={2}>
        {patient ? (
          <>
            <Typography variant='h6' gutterBottom>
              Send a Text Message to {patient.first_initial}.{patient.last_initial}.
            </Typography>
            <TextField
              fullWidth
              label='Message'
              multiline
              rows={4}
              variant='outlined'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              margin='normal'
            />
            {error && (
              <Typography color='error' variant='body2'>
                {error}
              </Typography>
            )}
            <Button variant='contained' color='primary' onClick={handleSendMessage} disabled={isSending} sx={{ mt: 2 }}>
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </>
        ) : (
          <Typography>Loading patient information...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default SendMessage;
