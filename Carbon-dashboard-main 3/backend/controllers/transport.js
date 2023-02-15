const { v4 } = require("uuid");

const addTransportController = async (req, res, next) => {
  try {
    const {
      co2,
      transportationMethod,
      bill,
      vehicleId,
      shipmentId,
      dateShipped,
    } = req.body;
    const { vendiaClient } = req.app.locals;

    await vendiaClient.entities.transportation.add({
      trackingId: v4(),
      co2,
      transportationMethod,
      vehicleId,
      shipmentId,
      bill,
      dateShipped,
    });

    res.json({ msg: "Success" });
  } catch (e) {
    next(e);
  }
};

const updateTransportController = async (req, res, next) => {
  try {
    const {
      _id,
      co2,
      transportationMethod,
      bill,
      vehicleId,
      shipmentId,
      dateShipped,
    } = req.body;
    const { vendiaClient } = req.app.locals;

    await vendiaClient.entities.transportation.update({
      _id,
      co2: +co2,
      transportationMethod,
      bill,
      vehicleId,
      shipmentId,
      dateShipped,
    });

    res.json({ msg: "Success" });
  } catch (e) {
    next(e);
  }
};

const getAllTransportsController = async (req, res, next) => {
  try {
    const { vendiaClient } = req.app.locals;

    const transportationList =
      await vendiaClient.entities.transportation.list();

    res.json(transportationList?.items);
  } catch (e) {
    next(e);
  }
};

const getTransportByTrackingIDController = async (req, res, next) => {
  try {
    const trackingId = req.params.trackingId;
    const { vendiaClient } = req.app.locals;

    const vendiaResponse = await vendiaClient.entities.transportation.list({
      filter: {
        trackingId: {
          eq: trackingId,
        },
      },
    });

    const transportRecord = vendiaResponse.items[0];

    if (!transportRecord) {
      const err = new Error("Not found");
      err.statusCode = 404;
      throw err;
    }

    if (transportRecord._id || transportRecord._owner) {
      delete transportRecord._id;
      delete transportRecord._owner;
    }

    res.json(transportRecord);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addTransportController,
  getAllTransportsController,
  getTransportByTrackingIDController,
  updateTransportController,
};
