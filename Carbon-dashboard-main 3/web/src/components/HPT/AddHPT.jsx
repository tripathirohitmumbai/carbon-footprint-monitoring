import React, { useState } from "react";
import axios from "axios";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MuiAutoComplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

import { httpGet } from "../../utils/axiosRequests";
import { useAuth } from "../../providers/auth";
import { getLatestCo2Value } from "../../utils/co2";

const AddHPT = ({ open, handleClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    toolType: "",
    serialNumber: "",
    imageURL: "",
    components: [],
    transport: null,
  });
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [isLoadingBattery, setIsLoadingBattery] = useState(true);
  const [batteryOptions, setBatteryOptions] = useState([]);

  const [selectedMotor, setSelectedMotor] = useState(null);
  const [isLoadingMotor, setIsLoadingMotor] = useState(true);
  const [motorOptions, setMotorOptions] = useState([]);

  const [selectedTransport, setSelectedTransport] = useState(null);
  const [isLoadingTransport, setIsLoadingTransport] = useState(true);
  const [transportOptions, setTransportOptions] = useState([]);

  const handleSubmit = () => {
    const components = [
      {
        type: "motor",
        serialNumber: selectedMotor.serialNumber,
        co2: +getLatestCo2Value(selectedMotor.co2).value,
      },
      {
        type: "battery",
        serialNumber: selectedBattery.serialNumber,
        co2: +getLatestCo2Value(selectedBattery.co2).value,
      },
    ];

    const transport = {
      transportationMethod: selectedTransport.transportationMethod,
      trackingId: selectedTransport.trackingId,
      co2: selectedTransport.co2,
    };

    const hptData = {
      ...formData,
      transport,
      components
    };

    axios.post("http://localhost:8001/hornetpowertool", hptData, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    });
    handleClose();
    setFormData({
      toolType: "",
      serialNumber: "",
      imageURL: "",
      components: [],
      transport: null,
    });
  };

  const handleChange = ({ name, value }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchMotors = async () => {
    const { data } = await httpGet({
      url: "/motor",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });

    if (data) {
      setMotorOptions(data);
    }

    setIsLoadingMotor(false);
  };

  const fetchBatteries = async () => {
    const { data } = await httpGet({
      url: "/battery",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });

    if (data) {
      setBatteryOptions(data);
    }

    setIsLoadingBattery(false);
  };

  const fetchTransports = async () => {
    const { data } = await httpGet({
      url: "/transport",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });

    if (data) {
      setTransportOptions(data);
    }

    setIsLoadingTransport(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        data-testid="add-battery-dialog"
      >
        <DialogTitle>Add Hornet Power Tool</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            margin="dense"
            label="Tool Type"
            name="toolType"
            color="secondary"
            type="text"
            fullWidth
            variant="standard"
            value={formData.toolType}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
          />
          <TextField
            data-testid={"add-battery-salesPrice-field"}
            margin="dense"
            label="Serial Number"
            name="serialNumber"
            type="text"
            color="secondary"
            fullWidth
            variant="standard"
            value={formData.serialNumber}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
          />
          <TextField
            data-testid={"add-battery-salesPrice-field"}
            margin="dense"
            label="Image URL"
            name="imageURL"
            type="text"
            color="secondary"
            fullWidth
            variant="standard"
            value={formData.imageURL}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
            style={{ marginBottom: "10px" }}
          />
          <MuiAutoComplete
            onFocus={() => {
              fetchMotors();
            }}
            onChange={(e, val) => {
              if (val) {
                setSelectedMotor(val);
              } else {
                setSelectedMotor(null);
              }
            }}
            sx={{ width: "300px" }}
            options={motorOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Select Motor"}
                variant="standard"
                color={"secondary"}
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {option.serialNumber} ${option.salesPrice}
              </Box>
            )}
            loading={isLoadingMotor}
            autoHighlight
            getOptionLabel={(option) => option.serialNumber}
            style={{ marginBottom: "10px" }}
          />
          <MuiAutoComplete
            onFocus={() => {
              fetchBatteries();
            }}
            onChange={(e, val) => {
              if (val) {
                setSelectedBattery(val);
              } else {
                setSelectedBattery(null);
              }
            }}
            sx={{ width: "300px" }}
            options={batteryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Select Battery"}
                variant="standard"
                color={"secondary"}
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {option.serialNumber} ${option.salesPrice}
              </Box>
            )}
            loading={isLoadingBattery}
            autoHighlight
            getOptionLabel={(option) => option.serialNumber}
            style={{ marginBottom: "10px" }}
          />
          <MuiAutoComplete
            onFocus={() => {
              fetchTransports();
            }}
            onChange={(e, val) => {
              if (val) {
                setSelectedTransport(val);
              } else {
                setSelectedTransport(null);
              }
            }}
            sx={{ width: "300px" }}
            options={transportOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Select Transport"}
                variant="standard"
                color={"secondary"}
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {option.shipmentId}: ${option.bill} - CO2: ${option.co2}
              </Box>
            )}
            loading={isLoadingTransport}
            autoHighlight
            getOptionLabel={(option) => option.shipmentId}
            style={{ marginBottom: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={handleSubmit}
            data-testid={"add-battery-submit-button"}
            disabled={
              !(
                formData.toolType &&
                formData.serialNumber &&
                formData.imageURL &&
                selectedMotor &&
                selectedBattery &&
                selectedTransport
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

export default AddHPT;
