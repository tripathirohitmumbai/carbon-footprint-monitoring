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
import Co2TableRows from "./Co2TableRows";
import { httpGet } from "../../utils/axiosRequests";

const UpdateBattery = ({ open, handleClose }) => {
  const { user } = useAuth();
  const [selectedBattery, setSelectedBattery] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [batteryOptions, setBatteryOptions] = useState([]);

  const submitUpdateForm = () => {
    axios.put("http://localhost:8001/battery", selectedBattery, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    });
    console.log(selectedBattery);
    handleClose();
    setSelectedBattery(null);
    setBatteryOptions([]);
  };

  const handleChange = ({ name, value }) => {
    setSelectedBattery({
      ...selectedBattery,
      [name]: value,
    });
  };

  const addCo2TableRows = () => {
    const lastRow = selectedBattery.co2[selectedBattery.co2.length - 1];
    if (selectedBattery.co2.length === 0 || (lastRow.value && lastRow.year)) {
      const rowsInput = {
        value: "",
        year: "",
      };
      const test = [...selectedBattery.co2];
      test.push(rowsInput);
      setSelectedBattery({
        ...selectedBattery,
        co2: test,
      });
    }
  };

  const deleteTableRows = (index) => {
    const rows = [...selectedBattery.co2];
    rows.splice(index, 1);
    setSelectedBattery({
      ...selectedBattery,
      co2: rows,
    });
  };

  const handleCo2Change = (index, event) => {
    const { name, value } = event.target;
    const rowsInput = [...selectedBattery.co2];
    rowsInput[index][name] = value;
    setSelectedBattery({
      ...selectedBattery,
      co2: rowsInput,
    });
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

    setIsLoading(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          setSelectedBattery(null);
          setBatteryOptions([]);
        }}
        fullWidth
        data-testid="add-battery-dialog"
      >
        <DialogTitle>Update Battery</DialogTitle>
        <DialogContent>
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
            loading={isLoading}
            autoHighlight
            getOptionLabel={(option) => option.serialNumber}
          />
          {selectedBattery && (
            <>
              <hr />
              <TextField
                data-testid={"add-battery-partNumber-field"}
                margin="dense"
                label="Serial Number"
                name="partNumber"
                color="secondary"
                type="text"
                fullWidth
                variant="filled"
                value={selectedBattery.serialNumber}
                style={{ margin: "10px" }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                data-testid={"add-battery-partNumber-field"}
                margin="dense"
                label="Part number"
                name="partNumber"
                color="secondary"
                type="text"
                fullWidth
                variant="standard"
                value={selectedBattery.partNumber}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                style={{ margin: "10px" }}
              />
              <TextField
                data-testid={"add-battery-salesPrice-field"}
                margin="dense"
                label="Sales price"
                name="salesPrice"
                type="number"
                color="secondary"
                fullWidth
                variant="standard"
                value={selectedBattery.salesPrice}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: +e.target.value })
                }
                style={{ margin: "10px", marginBottom: "14px" }}
              />
              <div style={{ margin: "10px" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Date Created"
                    inputFormat="MM/dd/yyyy"
                    value={selectedBattery.dateManufactured}
                    onChange={(value) => {
                      if (value) {
                        handleChange({
                          name: "dateManufactured",
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
              <div>
                <table
                  className="table"
                  style={{ borderSpacing: "8px", borderCollapse: "separate" }}
                >
                  <tbody>
                    <Co2TableRows
                      rowsData={selectedBattery.co2}
                      deleteTableRows={(i) => deleteTableRows(i)}
                      handleCo2Change={(i, e) => handleCo2Change(i, e)}
                    />
                  </tbody>
                  <IconButton
                    onClick={addCo2TableRows}
                    data-testid={"add-battery-button"}
                  >
                    <AddIcon />
                  </IconButton>
                </table>
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
            data-testid={"add-battery-submit-button"}
            disabled={!selectedBattery}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateBattery;
