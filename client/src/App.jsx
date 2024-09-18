import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import "./App.css";
import PatientSignIn from "./components/PatientSignIn";
import SendMessage from "./components/SendMessage";

function App() {
  return (
    <BrowserRouter>
      <main>
        <Box sx={{ mx: "64px", mt: "32px" }}>
          <Routes>
            <Route path='/' element={<PatientSignIn />} />
            <Route path='/send-message/:id' element={<SendMessage />} />
          </Routes>
        </Box>
      </main>
    </BrowserRouter>
  );
}

export default App;
