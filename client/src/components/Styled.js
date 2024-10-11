import { styled } from "@mui/material";
import { Link } from "react-router-dom";

export const Img = styled("img")({});
export const IFrame = styled("iframe")({});
export const StyledLink = styled(Link)({ textDecoration: "none", color: "inherit" });
export const H1 = styled("h1")({});
export const H2 = styled("h2")({});
export const H3 = styled("h3")({});
export const P = styled("p")({});
export const Button = styled("button")({});
export const Input = styled("input")({});
export const StyledSelect = styled("select")({
    appearance: "none", // Remove default browser styling for select items
    width: "100%",
    padding: "8px 40px 8px 8px",
    borderRadius: "4px",
    background: `url('data:image/svg+xml;utf8,<svg fill="%23000000" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat`, // Custom dropdown arrow (enlarged)
    backgroundSize: "24px", // size of the icon
    backgroundPosition: "calc(100% - 4px) center", // Move icon 4px from the right
    backgroundColor: "white",
    fontSize: "16px",
});
