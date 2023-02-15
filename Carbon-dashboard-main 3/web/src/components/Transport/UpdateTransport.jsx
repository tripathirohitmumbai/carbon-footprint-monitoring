import React, { useState } from "react";
import axios from "axios";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import AddIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Button from "@mui/material/Button";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MuiAutoComplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

import { useAuth } from "../../providers/auth";
import { httpGet } from "../../utils/axiosRequests";

const UpdateTransport = ({ open, handleClose }) => {
  const { user } = useAuth();
  const [selectedTransport, setSelectedTransport] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [motorOptions, setTransportOptions] = useState([]);

  const submitUpdateForm = () => {
    axios.put("http://localhost:8001/transport", selectedTransport, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    });
    handleClose();
    setSelectedTransport(null);
    setTransportOptions([]);
  };

  const handleChange = ({ name, value }) => {
    setSelectedTransport({
      ...selectedTransport,
      [name]: value,
    });
  };

  const fetchBatteries = async () => {
    const { data, status } = await httpGet({
      url: "/transport",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });

    if (data) {
      setTransportOptions(data);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          setSelectedTransport(null);
          setTransportOptions([]);
        }}
        fullWidth
        data-testid="add-transport-dialog"
      >
        <DialogTitle>Update Transport</DialogTitle>
        <DialogContent>
          <MuiAutoComplete
            onFocus={() => {
              fetchBatteries();
            }}
            onChange={(e, val) => {
              if (val) {
                setSelectedTransport(val);
              } else {
                setSelectedTransport(null);
              }
            }}
            sx={{ width: "300px" }}
            options={motorOptions}
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
                {option.shipmentId} ({option.vehicleId})
              </Box>
            )}
            loading={isLoading}
            autoHighlight
            getOptionLabel={(option) => option.shipmentId}
          />
          {selectedTransport && (
            <>
              <hr />
              <TextField
                data-testid={"add-motor-partNumber-field"}
                margin="dense"
                label="Transportation method"
                name="shipmentId"
                color="secondary"
                type="text"
                fullWidth
                variant="filled"
                value={selectedTransport.transportationMethod}
                style={{ margin: "10px" }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                data-testid={"add-motor-partNumber-field"}
                margin="dense"
                label="Vehicle ID"
                name="vehicleId"
                color="secondary"
                type="text"
                fullWidth
                variant="standard"
                value={selectedTransport.vehicleId}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                style={{ margin: "10px" }}
              />
              <TextField
                data-testid={"add-motor-partNumber-field"}
                margin="dense"
                label="Shipment ID"
                name="shipmentId"
                color="secondary"
                type="text"
                fullWidth
                variant="standard"
                value={selectedTransport.shipmentId}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                style={{ margin: "10px" }}
              />
              <TextField
                data-testid={"add-motor-partNumber-field"}
                margin="dense"
                label="CO2 value (KgCo2)"
                name="co2"
                color="secondary"
                type="number"
                fullWidth
                variant="standard"
                value={selectedTransport.co2}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                style={{ margin: "10px" }}
              />
              <TextField
                margin="dense"
                label="Charge (in USD)"
                name="bill"
                color="secondary"
                type="text"
                fullWidth
                variant="standard"
                value={selectedTransport.bill}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                style={{ margin: "10px" }}
              />

              <div style={{ margin: "10px" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Shipping date"
                    inputFormat="MM/dd/yyyy"
                    value={selectedTransport.dateShipped}
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
                        data-testid="add-motor-dateManufactured-field"
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={submitUpdateForm}
            data-testid={"add-motor-submit-button"}
            disabled={!selectedTransport}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateTransport;
