const addMotorController = async (req, res, next) => {
  try {
    const { partNumber, serialNumber, dateManufactured, salesPrice } = req.body;
    const { vendiaClient } = req.app.locals;

    await vendiaClient.entities.motor.add({
      partNumber,
      serialNumber,
      co2: [],
      dateManufactured,
      salesPrice,
    });

    res.json({ msg: "Success" });
  } catch (e) {
    next(e);
  }
};

const updateMotorController = async (req, res, next) => {
  try {
    const { _id, partNumber, serialNumber, co2, dateManufactured, salesPrice } =
      req.body;
    const { vendiaClient } = req.app.locals;

    await vendiaClient.entities.motor.update({
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

const getAllMotorsController = async (req, res, next) => {
  try {
    const { vendiaClient } = req.app.locals;

    const motorList = await vendiaClient.entities.motor.list();

    res.json(motorList?.items);
  } catch (e) {
    next(e);
  }
};

const getMotorBySNController = async (req, res, next) => {
  try {
    const serialNum = req.params.serialNumber;
    const { vendiaClient } = req.app.locals;

    const vendiaResponse = await vendiaClient.entities.motor.list({
      filter: {
        serialNumber: {
          eq: serialNum,
        },
      },
    });

    const motorRecord = vendiaResponse.items[0];

    if (!motorRecord) {
      const err = new Error("Not found");
      err.statusCode = 404;
      throw err;
    }

    if (motorRecord._id || motorRecord._owner) {
      delete motorRecord._id;
      delete motorRecord._owner;
    }

    res.json(motorRecord);
  } catch (e) {
    next(e);
  }
};
module.exports = {
  getAllMotorsController,
  addMotorController,
  updateMotorController,
  getMotorBySNController,
};
