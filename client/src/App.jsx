import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import "./App.css";
import PatientSignIn from "./components/PatientSignIn";
import SendMessage from "./components/SendMessage";
import Appointments from "./components/Appointments";

function App() {
  return (
    <BrowserRouter>
      <main>
        <Box sx={{ mx: { xs: "0", lg: "64px" }, mt: { xs: "0", lg: "32px" } }}>
          <Routes>
            <Route path='/' element={<PatientSignIn />} />
            <Route path='/send-message/:id' element={<SendMessage />} />
            <Route path='/appointments' element={<Appointments />} />
          </Routes>
        </Box>
      </main>
    </BrowserRouter>
  );
}

export default App;
