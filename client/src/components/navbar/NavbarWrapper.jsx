import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
  const location = useLocation();

  // Define the routes where you want the Navbar to appear
  const noNavbarRoutes = ["/patient_sign_in", "/send_message"];

  // Check if the current path is one of the routes in noNavbarRoutes
  const showNavbar = !noNavbarRoutes.some((route) => location.pathname.startsWith(route));

  return showNavbar ? <Navbar /> : null;
};

export default NavbarWrapper;
