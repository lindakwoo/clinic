import React, { useEffect, useState } from "react";
import customFetch from "./fetchWrapper";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const Therapists = () => {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);
  const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";

  const fetchTherapists = async () => {
    try {
      const url = `${apiUrl}/api/therapists/`;
      const options = { method: "GET" };
      const response = await customFetch(url, options);
      setTherapists(response.therapists);
    } catch (error) {
      console.error("There was an error fetching the therapists!", error);
    }
  };

  const deleteTherapist = async (id) => {
    try {
      const url = `${apiUrl}/api/therapists/${id}/delete/`; // Update the URL based on your backend route
      const options = {
        method: "DELETE",
      };
      await customFetch(url, options);
      // Refresh the therapists list after deletion
      fetchTherapists();
    } catch (error) {
      console.error("There was an error deleting the therapist!", error);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  return (
    <>
      <Box style={{ display: "flex", justifyContent: "center", marginBottom: "20px", width: "200px", margin: "auto" }}>
        <img src='/images/uplift4FINAL.jpg' alt='uplift logo' style={{ maxWidth: "100%", height: "auto" }} />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant='contained'
          sx={{ backgroundColor: "#007bff", color: "white", "&:hover": { backgroundColor: "#0056b3" } }}
          onClick={() => navigate("/therapists/create")}
        >
          Add a Therapist
        </Button>
      </Box>
      <Box sx={{ p: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant='h5' component='div'>
              Therapists Dashboard
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              View the list of therapists
            </Typography>
          </CardContent>
        </Card>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Therapist</TableCell>
                <TableCell>Phone number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {therapists.map((therapist) => (
                <TableRow key={therapist.id}>
                  <TableCell>
                    {therapist.first_name} {therapist.last_name}
                  </TableCell>
                  <TableCell>{therapist.phone_number}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label='delete'
                      onClick={() => deleteTherapist(therapist.id)}
                      color='error' // Optional: color for the delete button
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Therapists;
