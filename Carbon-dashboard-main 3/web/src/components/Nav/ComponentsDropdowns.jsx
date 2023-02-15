import React from "react";

import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { AddBattery, UpdateBattery } from "../Battery";
import { AddMotor, UpdateMotor } from "../Motor";
import { AddTransport, UpdateTransport } from "../Transport";

const ComponentsDropdowns = () => {
  const [anchorElBattery, setAnchorElBattery] = React.useState(null);
  const [anchorElMotor, setAnchorElMotor] = React.useState(null);
  const [anchorElTransport, setAnchorElTransport] = React.useState(null);
  const [componentOpen, setComponentOpen] = React.useState("");

  const handleClickBattery = (event) => {
    setAnchorElBattery(event.currentTarget);
  };
  const handleCloseBattery = () => {
    setAnchorElBattery(null);
  };

  const handleClickMotor = (event) => {
    setAnchorElMotor(event.currentTarget);
  };
  const handleCloseMotor = () => {
    setAnchorElMotor(null);
  };

  const handleClickTransport = (event) => {
    setAnchorElTransport(event.currentTarget);
  };
  const handleCloseTransport = () => {
    setAnchorElTransport(null);
  };

  return (
    <div>
      <Button
        id="long-button"
        aria-haspopup="true"
        onClick={handleClickBattery}
        color="secondary"
      >
        Battery
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorElBattery}
        open={!!anchorElBattery}
        onClose={handleCloseBattery}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => setComponentOpen("addBattery")}>Add</MenuItem>
        <MenuItem onClick={() => setComponentOpen("updateBattery")}>
          Edit
        </MenuItem>
      </Menu>
      <Button
        id="long-button"
        aria-haspopup="true"
        onClick={handleClickMotor}
        color="secondary"
      >
        Motor
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorElMotor}
        open={!!anchorElMotor}
        onClose={handleCloseMotor}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => setComponentOpen("addMotor")}>Add</MenuItem>
        <MenuItem onClick={() => setComponentOpen("updateMotor")}>
          Edit
        </MenuItem>
      </Menu>
      <Button
        id="long-button"
        aria-haspopup="true"
        onClick={handleClickTransport}
        color="secondary"
      >
        Transport
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorElTransport}
        open={!!anchorElTransport}
        onClose={handleCloseTransport}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => setComponentOpen("addTransport")}>
          Add
        </MenuItem>
        <MenuItem onClick={() => setComponentOpen("updateTransport")}>
          Edit
        </MenuItem>
      </Menu>
      <AddBattery
        open={componentOpen === "addBattery"}
        handleClose={() => setComponentOpen("")}
      />
      <UpdateBattery
        open={componentOpen === "updateBattery"}
        handleClose={() => setComponentOpen("")}
      />
      <AddMotor
        open={componentOpen === "addMotor"}
        handleClose={() => setComponentOpen("")}
      />
      <UpdateMotor
        open={componentOpen === "updateMotor"}
        handleClose={() => setComponentOpen("")}
      />
      <AddTransport
        open={componentOpen === "addTransport"}
        handleClose={() => setComponentOpen("")}
      />
      <UpdateTransport
        open={componentOpen === "updateTransport"}
        handleClose={() => setComponentOpen("")}
      />
    </div>
  );
};

export default ComponentsDropdowns;
