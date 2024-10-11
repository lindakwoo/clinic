import React from "react";
import { StyledLink } from "../Styled";
import { useLocation } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";

const MobileMenuItem = ({ path, onClickHandler, title, highlight = true }) => {
  const location = useLocation();
  return (
    <MenuItem
      onClick={onClickHandler}
      sx={{
        backgroundColor: location.pathname === path ? (highlight ? "#dce0e2" : "transparent") : "transparent",
      }}
      color='inherit'
    >
      {" "}
      <StyledLink to={path}>{title}</StyledLink>
    </MenuItem>
  );
};

export default MobileMenuItem;
