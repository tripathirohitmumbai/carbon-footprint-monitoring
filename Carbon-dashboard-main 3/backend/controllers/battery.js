const addBatteryController = async (req, res, next) => {
  try {
    const { partNumber, serialNumber, dateManufactured, salesPrice, co2 } =
      req.body;
    const { vendiaClient } = req.app.locals;

    await vendiaClient.entities.battery.add({
      partNumber,
      serialNumber,
      co2,
      dateManufactured,
      salesPrice,
    });

    res.json({ msg: "Success" });
  } catch (e) {
    next(e);
  }
};

const updateBatteryController = async (req, res, next) => {
  try {
    const { _id, partNumber, serialNumber, co2, dateManufactured, salesPrice } =
      req.body;
    const { vendiaClient } = req.app.locals;

    await vendiaClient.entities.battery.update({
      _id,
      partNumber,
      serialNumber,
      co2,
      dateManufactured,
      salesPrice,
    });

    res.json({ msg: "Success" });
  } catch (e) {
    next(e);
  }
};

const getAllBatteriesController = async (req, res, next) => {
  try {
    const { vendiaClient } = req.app.locals;

    const batteryList = await vendiaClient.entities.battery.list();

    res.json(batteryList?.items);
  } catch (e) {
    next(e);
  }
};

const getBatteryBySNController = async (req, res, next) => {
  try {
    const serialNum = req.params.serialNumber;
    const { vendiaClient } = req.app.locals;

    const vendiaResponse = await vendiaClient.entities.battery.list({
      filter: {
        serialNumber: {
          eq: serialNum,
        },
      },
    });

    const batteryRecord = vendiaResponse.items[0];

    if (!batteryRecord) {
      const err = new Error("Not found");
      err.statusCode = 404;
      throw err;
    }

    if (batteryRecord._id || batteryRecord._owner) {
      delete batteryRecord._id;
      delete batteryRecord._owner;
    }

    res.json(batteryRecord);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllBatteriesController,
  addBatteryController,
  updateBatteryController,
  getBatteryBySNController,
};
