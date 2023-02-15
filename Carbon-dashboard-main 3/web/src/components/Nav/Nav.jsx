import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAuth } from "../../providers/auth";
import AccountMenu from "./AccountMenu";
import ComponentsDropdowns from "./ComponentsDropdowns";

const Nav = () => {
  const auth = useAuth();
  const isAdmin = auth.user.privileges === "admin";

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "fantasy",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              CO2 Dashboard
            </Typography>
            <Box sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
              {isAdmin && <ComponentsDropdowns />}
              <AccountMenu />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Nav;
