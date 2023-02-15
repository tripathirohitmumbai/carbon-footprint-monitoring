import React from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { httpGet } from "../../utils/axiosRequests";
import { CircularProgress } from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const renderKeyValue = (icon, key, value) => {
  return (
    <div>
      <Typography
        color="text.secondary"
        component="span"
        variant="body2"
        fontSize={"13px"}
      >
        {key}{" "}
      </Typography>
      <Typography component="span" variant="body2" fontSize={"13px"}>
        {value}
      </Typography>
    </div>
  );
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "CO2 data",
    },
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

const ComponentInfo = ({ data }) => {
  const labels = data.co2 ? data.co2.map((x) => x.year) : [];
  labels.sort(function (a, b) {
    return a - b;
  });

  const obj = {};
  data.co2.forEach((x) => (obj[x.year] = x.value));

  const chartData = {
    labels,
    datasets: [
      {
        borderWidth: 1,
        borderColor: "green",
        label: "CO2 (KgCo2)",
        data: obj,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <>
      <Box
        sx={{
          margin: 0.5,
          display: "flex",
          height: "200px",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div style={{ width: "45%", padding: "8px" }}>
          {renderKeyValue(null, "Serial Number:", data.serialNumber)}
          {renderKeyValue(null, "Sales Price:", data.salesPrice)}
          {renderKeyValue(
            null,
            "Date Created:",
            new Date(data.salesPrice).toDateString()
          )}
        </div>
        <Divider orientation="vertical" flexItem />
        <div style={{ width: "70%", paddingLeft: "10px" }}>
          <Line options={options} data={chartData} />
        </div>
      </Box>
    </>
  );
};

const TransportInfo = ({ data }) => {
  return (
    <>
      <div style={{ width: "45%", padding: "8px" }}>
        {renderKeyValue(null, "Transportation Method:", data.transportationMethod)}
        {renderKeyValue(null, "Vehicle ID:", data.vehicleId)}
        {renderKeyValue(
          null,
          "Shipment ID:",
          data.shipmentId
        )}
        {renderKeyValue(
          null,
          "CO2 Value (KgCO2):",
          data.co2
        )}
        {renderKeyValue(
          null,
          "Charge (in USD):",
          data.bill
        )}
        {renderKeyValue(
          null,
          "Shipment ID:",
          new Date(data.dateShipped).toDateString()
        )}
      </div>
    </>
  );
};

const InfoDialog = ({ open, handleClose, data }) => {
  const [value, setValue] = React.useState(0);
  const [infoData, setInfoData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (data) {
      const battery = data.components.find((comp) => comp.type === "battery");
      const motor = data.components.find((comp) => comp.type === "motor");

      const transportTrackingId = data.transport.trackingId;

      const fetchData = async () => {
        const [batteryRes, motorRes, transportRes] = await Promise.all([
          httpGet({
            url: `/battery/${battery.serialNumber}`,
          }),
          httpGet({
            url: `/motor/${motor.serialNumber}`,
          }),
          httpGet({
            url: `/transport/${transportTrackingId}`,
          }),
        ]);

        setInfoData({
          battery: batteryRes.data,
          motor: motorRes.data,
          transport: transportRes.data,
        });
        setIsLoading(false);
      };

      fetchData();
    }
  }, [data]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Info</DialogTitle>
        <DialogContent>
          {isLoading && <CircularProgress />}
          {infoData && (
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  textColor="secondary"
                  indicatorColor="secondary"
                >
                  <Tab label="Battery" color="secondary" {...a11yProps(0)} />
                  <Tab label="Motor" color="secondary" {...a11yProps(1)} />
                  <Tab label="Transport" color="secondary" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <ComponentInfo data={infoData.battery} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <ComponentInfo data={infoData.motor} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <TransportInfo data={infoData.transport} />
              </TabPanel>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoDialog;
