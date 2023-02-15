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

import { useAuth } from "../../providers/auth";
import Co2TableRows from "./Co2TableRows";

const Motor = ({ open, handleClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    serialNumber: "",
    partNumber: "",
    co2: [{ year: "", value: "" }],
    dateManufactured: new Date().toISOString().split("T")[0],
    salesPrice: "",
  });

  const submitUpdateForm = () => {
    axios.post("http://localhost:8001/motor", formData, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    });
    handleClose();
    setFormData({
      serialNumber: "",
      partNumber: "",
      co2: [{ year: "", value: "" }],
      dateManufactured: new Date().toISOString().split("T")[0],
      salesPrice: "",
    });
  };

  const handleChange = ({ name, value }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addCo2TableRows = () => {
    const lastRow = formData.co2[formData.co2.length - 1];
    if (formData.co2.length === 0 || (lastRow.value && lastRow.year)) {
      const rowsInput = {
        value: "",
        year: "",
      };
      const test = [...formData.co2];
      test.push(rowsInput);
      setFormData({
        ...formData,
        co2: test,
      });
    }
  };

  const deleteTableRows = (index) => {
    const rows = [...formData.co2];
    rows.splice(index, 1);
    setFormData({
      ...formData,
      co2: rows,
    });
  };

  const handleCo2Change = (index, event) => {
    const { name, value } = event.target;
    const rowsInput = [...formData.co2];
    rowsInput[index][name] = value;
    setFormData({
      ...formData,
      co2: rowsInput,
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
        fullWidth
        data-testid="add-motor-dialog"
      >
        <DialogTitle>Add Motor</DialogTitle>
        <DialogContent>
          <TextField
            data-testid={"add-motor-serialNumber-field"}
            autoFocus
            margin="dense"
            label="Serial number"
            color="secondary"
            name="serialNumber"
            type="text"
            fullWidth
            variant="standard"
            value={formData.serialNumber}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
            style={{ margin: "10px" }}
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
            value={formData.partNumber}
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
            value={formData.salesPrice}
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
                value={formData.dateManufactured}
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
                  rowsData={formData.co2}
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
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={submitUpdateForm}
            data-testid={"add-motor-submit-button"}
            disabled={
              !(
                formData.dateManufactured &&
                formData.partNumber &&
                formData.serialNumber &&
                formData.salesPrice
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

export default Motor;
