require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { VendiaService } = require("./vendiaService");
const { getHptBySNController, addHptController } = require("./controllers/hpt");
const { loginUserController } = require("./controllers/user");
const { isAuth } = require("./middlewares/is-auth");
const {
  getAllBatteriesController,
  updateBatteryController,
  getBatteryBySNController,
  addBatteryController,
} = require("./controllers/battery");
const {
  getAllMotorsController,
  addMotorController,
  updateMotorController,
  getMotorBySNController,
} = require("./controllers/motor");
const {
  addTransportController,
  getAllTransportsController,
  getTransportByTrackingIDController,
  updateTransportController
} = require("./controllers/transport");

const port = process.env.PORT || 8001;

const app = express();

const vendiaService = new VendiaService();
vendiaService.new();
app.locals.vendiaClient = vendiaService.getInstance();

app.use(cors());
app.use(express.json());

app.get("/hornetpowertool/:serialNumber", isAuth, getHptBySNController);
app.post("/hornetpowertool", isAuth, addHptController);

app.get("/battery", getAllBatteriesController);
app.get("/battery/:serialNumber", getBatteryBySNController);
app.put("/battery", updateBatteryController);
app.post("/battery", addBatteryController);

app.get("/motor", getAllMotorsController);
app.get("/motor/:serialNumber", getMotorBySNController);
app.put("/motor", updateMotorController);
app.post("/motor", addMotorController);

app.post("/transport", addTransportController);
app.get("/transport", getAllTransportsController);
app.get("/transport/:trackingId", getTransportByTrackingIDController);
app.put("/transport", updateTransportController);

app.post("/login", loginUserController);

app.use((error, req, res, next) => {
  console.log(error);

  if (!error.statusCode) {
    error.statusCode = 500;
    error.message = "Server Error";
  }

  const errRes = {
    error: {
      message: error.message,
      status: error.statusCode,
    },
  };

  res.status(error.statusCode).json(errRes);
});

app.listen(port, function () {
  console.log("Server is running on " + port);
});
