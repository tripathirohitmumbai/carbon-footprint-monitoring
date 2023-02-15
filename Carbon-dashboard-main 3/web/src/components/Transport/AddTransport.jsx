import React, { useState } from "react";
import axios from "axios";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Button from "@mui/material/Button";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../../providers/auth";

const AddTransport = ({ open, handleClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    transportationMethod: "",
    vehicleId: "",
    shipmentId: "",
    dateShipped: new Date().toISOString().split("T")[0],
    co2: "",
    bill: "",
  });

  const submitUpdateForm = () => {
    axios.post("http://localhost:8001/transport", formData, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    });
    handleClose();
    setFormData({
      transportationMethod: "",
      vehicleId: "",
      shipmentId: "",
      dateShipped: new Date().toISOString().split("T")[0],
      co2: "",
      bill: "",
    });
  };

  const handleChange = ({ name, value }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        data-testid="add-battery-dialog"
      >
        <DialogTitle>Add Transportation</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormControl
            name={"transportationMethod"}
            variant="standard"
            fullWidth
            color="secondary"
          >
            <InputLabel>{"Transportation Method"}</InputLabel>
            <Select
              value={
                formData.transportationMethod
                  ? formData.transportationMethod
                  : ""
              }
              name={"transportationMethod"}
              onChange={(e) => {
                handleChange({ name: e.target.name, value: e.target.value });
              }}
            >
              {[
                {
                  value: "ground",
                  label: "Ground",
                },
                {
                  value: "ship",
                  label: "Ship",
                },
              ].map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Vehicle ID"
            name="vehicleId"
            color="secondary"
            type="text"
            fullWidth
            variant="standard"
            value={formData.vehicleId}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
          />
          <TextField
            data-testid={"add-battery-salesPrice-field"}
            margin="dense"
            label="Shipment ID"
            name="shipmentId"
            type="text"
            color="secondary"
            fullWidth
            variant="standard"
            value={formData.shipmentId}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="CO2 value (KgCo2)"
            name="co2"
            color="secondary"
            type="number"
            fullWidth
            variant="standard"
            value={formData.co2}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: +e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Charge (in USD)"
            name="bill"
            color="secondary"
            type="text"
            fullWidth
            variant="standard"
            value={formData.bill}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
            style={{ marginBottom: "14px" }}

          />

          <div style={{ margin: "10px" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Shipping date"
                inputFormat="MM/dd/yyyy"
                value={formData.dateShipped}
                onChange={(value) => {
                  if (value) {
                    handleChange({
                      name: "dateShipped",
                      value: new Date(value).toISOString().split("T")[0],
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="secondary"
                    data-testid="add-battery-dateManufactured-field"
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={submitUpdateForm}
            data-testid={"add-battery-submit-button"}
            disabled={
              !(
                formData.transportationMethod &&
                formData.shipmentId &&
                formData.vehicleId &&
                formData.co2 &&
                formData.bill
              )
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTransport;
