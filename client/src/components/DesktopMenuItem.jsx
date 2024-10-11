import React from "react";
import { StyledLink } from "./Styled";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material";

const Button = styled("button")({
  border: "none",
  color: "white",
  padding: "16px",
  backgroundColor: "transparent",
  fontWeight: "bold",
  "&:hover": { color: "yellow" },
});

const DesktopMenuItem = ({ path, onClickHandler, title, highlight = true }) => {
  const location = useLocation();
  return (
    <Button
      onClick={onClickHandler}
      sx={{
        color: location.pathname === path ? (highlight ? "yellow" : "white") : "white",
        backgroundColor: location.pathname === path ? (highlight ? "#077eba" : "transparent") : "transparent",
      }}
      color='inherit'
    >
      {" "}
      <StyledLink sx={{ "&:hover": { color: "yellow" } }} to={path}>
        {title}
      </StyledLink>
    </Button>
  );
};

export default DesktopMenuItem;
