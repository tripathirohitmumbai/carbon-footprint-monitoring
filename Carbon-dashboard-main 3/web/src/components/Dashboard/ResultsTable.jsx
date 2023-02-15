import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAuth } from "../../providers/auth";
import InfoDialog from "./InfoDialog";

function Row(props) {
  const { row, isAdmin } = props;
  const [open, setOpen] = React.useState(false);
  const [infoOpen, setInfoOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            data-testid="expand-button"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {isAdmin && (
          <>
            <TableCell>
              <IconButton
                size="small"
                onClick={() => setInfoOpen(true)}
                data-testid="expand-button"
              >
                <InfoIcon />
              </IconButton>
              <InfoDialog
                open={infoOpen}
                handleClose={() => setInfoOpen(false)}
                data={row}
              />
            </TableCell>
          </>
        )}
        <TableCell scope="row">
          <img src={row.imageURL} width="40px" alt={row.toolType} />
        </TableCell>
        <TableCell component="th" scope="row">
          {row.serialNumber}
        </TableCell>
        <TableCell align="left">{row.date}</TableCell>
        <TableCell align="center">{row.toolType}</TableCell>
        <TableCell align="center">{row.totalCo2}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                display: "flex",
                height: "300px",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <img src={row.imageURL} width="250px" alt={row.toolType} />
              <Divider orientation="vertical" flexItem />
              <Table sx={{ width: 300 }} aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: "650" }}>
                        Component
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: "650" }}>
                        CO2 Value {`(in kgCo2)`}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.components.map((component) => {
                    return (
                      <TableRow
                        key={component.serialNumber}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left">
                          {capitalizeFirstLetter(component.type)}
                        </TableCell>
                        <TableCell align="right">{component.co2}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align="left">Transport</TableCell>
                    <TableCell align="right">{row.transport.co2}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function ResultsTable({ data }) {
  const { user } = useAuth();
  const isAdmin = user.privileges === "admin";
  const tableRow = formatData(data);

  return (
    <TableContainer sx={{ width: "800px" }} component={Paper}>
      <Table aria-label="collapsible table" data-testid="hpt-results-table">
        <TableHead>
          <TableRow>
            <TableCell />
            {isAdmin && <TableCell />}
            <TableCell />
            <TableCell sx={{ fontWeight: "650" }}>SN#</TableCell>
            <TableCell align="left" sx={{ fontWeight: "650" }}>
              Shipping date
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "650" }}>
              Tool Type
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "650" }}>
              Total CO2
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <Row key={tableRow.serialNumber} row={tableRow} isAdmin={isAdmin} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const formatData = (data) => {
  const { components, imageURL, serialNumber, toolType, transport } = data;

  const totalComponentC02 = components.reduce(
    (acc, current) => +current.co2 + acc,
    0
  );

  const totalCo2 = totalComponentC02 + transport.co2;

  return {
    totalCo2,
    imageURL,
    serialNumber,
    components,
    transport,
    toolType,
    date: new Date(new Date() - Math.random() * 1e12).toLocaleDateString(),
  };
};
