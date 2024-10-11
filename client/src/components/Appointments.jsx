import React, { useEffect, useState } from "react";
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
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useParams } from "react-router-dom";
import customFetch from "./fetchWrapper";

const Appointments = () => {
  const { org } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterWeek, setFilterWeek] = useState("");

  const fetchAppointments = async () => {
    try {
      const url = `http://localhost:8000/api/appointments/${org}/`;
      const options = { method: "GET" };
      const response = await customFetch(url, options);
      setAppointments(response.appointments);
    } catch (error) {
      console.error("There was an error fetching the appointments!", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = dateObj.toLocaleDateString(undefined, options);
    const formattedTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${formattedDate} at ${formattedTime}`;
  };

  const handleFilterChange = (type, value) => {
    if (type === "date") {
      setFilterDate(value);
      setFilterMonth("");
      setFilterWeek("");
    } else if (type === "month") {
      setFilterMonth(value);
      setFilterDate("");
      setFilterWeek("");
    } else if (type === "week") {
      setFilterWeek(value);
      setFilterDate("");
      setFilterMonth("");
    }
  };

  const resetFilters = () => {
    setFilterDate("");
    setFilterMonth("");
    setFilterWeek("");
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      if (filterDate) {
        return appointment.date === filterDate;
      }
      return true; // Show all if no date filter
    })
    .filter((appointment) => {
      if (filterMonth) {
        const appointmentMonth = new Date(appointment.date).toLocaleString("default", { month: "long" });
        return appointmentMonth.toLowerCase() === filterMonth.toLowerCase();
      }
      return true; // Show all if no month filter
    })
    .filter((appointment) => {
      if (filterWeek === "last") {
        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        const lastWeekStart = new Date();
        lastWeekStart.setDate(today.getDate() - 7); // Start date for last week
        return appointmentDate >= lastWeekStart && appointmentDate <= today;
      }
      return true; // Show all if no week filter
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent

  return (
    <>
      <Box style={{ display: "flex", justifyContent: "center", marginBottom: "20px", width: "200px", margin: "auto" }}>
        <img src='/images/uplift4FINAL.jpg' alt='uplift logo' style={{ maxWidth: "100%", height: "auto" }} />
      </Box>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          type='date'
          label='Filter by Date'
          variant='outlined'
          value={filterDate}
          onChange={(e) => handleFilterChange("date", e.target.value)}
          InputLabelProps={{ shrink: true }}
          size='small'
        />
        <FormControl size='small' sx={{ minWidth: 150 }}>
          {" "}
          {/* Set a minimum width for the month select */}
          <InputLabel id='month-select-label'>Filter by Month</InputLabel>
          <Select
            labelId='month-select-label'
            value={filterMonth}
            onChange={(e) => handleFilterChange("month", e.target.value)}
            label='Filter by Month'
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          onClick={() => handleFilterChange("week", "last")}
          sx={{ backgroundColor: "#007bff", color: "white", "&:hover": { backgroundColor: "#0056b3" } }}
        >
          Filter by Last Week
        </Button>
        <Button
          variant='contained'
          onClick={resetFilters}
          sx={{ backgroundColor: "#007bff", color: "white", "&:hover": { backgroundColor: "#0056b3" } }}
        >
          SHOW ALL
        </Button>
      </Box>
      <Box sx={{ p: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant='h5' component='div'>
              Appointments Dashboard
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              View the list of appointments
            </Typography>
          </CardContent>
        </Card>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Phone number</TableCell>
                <TableCell>Therapist</TableCell>
                <TableCell>Date and time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {appointment.patient.first_initial}
                    {appointment.patient.last_initial}
                  </TableCell>
                  <TableCell>{appointment.patient.phone_number}</TableCell>
                  <TableCell>{appointment.therapist_name}</TableCell>
                  <TableCell>{formatDateTime(appointment.date, appointment.time)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Appointments;
