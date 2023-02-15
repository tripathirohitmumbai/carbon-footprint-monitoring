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

const UpdateMotor = ({ open, handleClose }) => {
  const { user } = useAuth();
  const [selectedMotor, setSelectedMotor] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [motorOptions, setMotorOptions] = useState([]);

  const submitUpdateForm = () => {
    axios.put("http://localhost:8001/motor", selectedMotor, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    });
    handleClose();
    setSelectedMotor(null);
    setMotorOptions([]);
  };

  const handleChange = ({ name, value }) => {
    setSelectedMotor({
      ...selectedMotor,
      [name]: value,
    });
  };

  const addCo2TableRows = () => {
    const lastRow = selectedMotor.co2[selectedMotor.co2.length - 1];
    if (selectedMotor.co2.length === 0 || (lastRow.value && lastRow.year)) {
      const rowsInput = {
        value: "",
        year: "",
      };
      const test = [...selectedMotor.co2];
      test.push(rowsInput);
      setSelectedMotor({
        ...selectedMotor,
        co2: test,
      });
    }
  };

  const deleteTableRows = (index) => {
    const rows = [...selectedMotor.co2];
    rows.splice(index, 1);
    setSelectedMotor({
      ...selectedMotor,
      co2: rows,
    });
  };

  const handleCo2Change = (index, event) => {
    const { name, value } = event.target;
    const rowsInput = [...selectedMotor.co2];
    rowsInput[index][name] = value;
    setSelectedMotor({
      ...selectedMotor,
      co2: rowsInput,
    });
  };

  const fetchBatteries = async () => {
    const { data, status } = await httpGet({
      url: "/motor",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    });

    if (data) {
      setMotorOptions(data);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          setSelectedMotor(null);
          setMotorOptions([]);
        }}
        fullWidth
        data-testid="add-motor-dialog"
      >
        <DialogTitle>Update Motor</DialogTitle>
        <DialogContent>
          <MuiAutoComplete
            onFocus={() => {
              fetchBatteries();
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
            loading={isLoading}
            autoHighlight
            getOptionLabel={(option) => option.serialNumber}
          />
          {selectedMotor && (
            <>
              <hr />
              <TextField
                data-testid={"add-motor-partNumber-field"}
                margin="dense"
                label="Serial Number"
                name="partNumber"
                color="secondary"
                type="text"
                fullWidth
                variant="filled"
                value={selectedMotor.serialNumber}
                style={{ margin: "10px" }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                data-testid={"add-motor-partNumber-field"}
                margin="dense"
                label="Part number"
                name="partNumber"
                color="secondary"
                type="text"
                fullWidth
                variant="standard"
                value={selectedMotor.partNumber}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                style={{ margin: "10px" }}
              />
              <TextField
                data-testid={"add-motor-salesPrice-field"}
                margin="dense"
                label="Sales price"
                name="salesPrice"
                type="number"
                color="secondary"
                fullWidth
                variant="standard"
                value={selectedMotor.salesPrice}
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
                    value={selectedMotor.dateManufactured}
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
                        data-testid="add-motor-dateManufactured-field"
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
                      rowsData={selectedMotor.co2}
                      deleteTableRows={(i) => deleteTableRows(i)}
                      handleCo2Change={(i, e) => handleCo2Change(i, e)}
                    />
                  </tbody>
                  <IconButton
                    onClick={addCo2TableRows}
                    data-testid={"add-motor-button"}
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
            data-testid={"add-motor-submit-button"}
            disabled={!selectedMotor}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateMotor;
