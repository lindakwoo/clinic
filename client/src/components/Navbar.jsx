import React, { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AuthContext } from "../context/AuthContext";
import customFetch from "./fetchWrapper";
import { useNavigate } from "react-router-dom";
import { StyledLink, StyledSelect, Img } from "./Styled";
import DesktopMenuItem from "./DesktopMenuItem";
import MobileMenuItem from "./MobileMeniItem";

const Navbar = () => {
  const { logout, isAuth } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const handleLogin = () => {
    handleMenuClose();
    navigate("/login");
  };

  const handleSignup = () => {
    handleMenuClose();
    navigate("/signup/uplift");
  };

  return (
    isAuth && (
      <AppBar position='fixed' sx={{ backgroundColor: "#0288d1", width: "100%" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "start", alignItems: "center" }}>
            <Img src='/images/uplift4FINAL.jpg' sx={{ height: "70px", width: "auto" }} />
            <Typography
              variant='h6'
              sx={{
                fontWeight: "bold",
                fontSize: "24px",
              }}
            >
              <StyledLink
                sx={{
                  "&:hover": { color: "yellow" },
                }}
                to='/'
              >
                Uplift
              </StyledLink>
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            {<DesktopMenuItem path='/home' onClickHandler={() => {}} title='Home' />}
            {!isAuth && (
              <DesktopMenuItem
                path='/signup/uplift'
                onClickHandler={() => setIsSignup(true)}
                title='Signup'
                highlight={false}
              />
            )}
            {!isAuth && (
              <DesktopMenuItem path='/login' onClickHandler={() => setIsLogin(true)} title='Login' highlight={false} />
            )}
            {isAuth && <DesktopMenuItem path='#' onClickHandler={handleLogout} title='Logout' />}
          </Box>
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton edge='start' color='inherit' aria-label='menu' onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {<MobileMenuItem path='/home' onClickHandler={handleMenuClose} title='Home' />}

            {!isAuth && (
              <MobileMenuItem path='/signup/uplift' onClickHandler={handleSignup} title='Signup' highlight={false} />
            )}
            {!isAuth && <MobileMenuItem path='/login' onClickHandler={handleLogin} title='Login' highlight={false} />}
            {isAuth && <MobileMenuItem path='/logout' onClickHandler={handleLogout} title='Logout' highlight={false} />}
          </Menu>
        </Toolbar>
      </AppBar>
    )
  );
};

export default Navbar;
