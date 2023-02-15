const getHptBySNController = async (req, res, next) => {
  try {
    const serialNum = req.params.serialNumber;
    const { vendiaClient } = req.app.locals;

    const vendiaResponse = await getHPTFromVendia(serialNum, vendiaClient);

    const hptRecord = vendiaResponse.items[0];

    if (!hptRecord) {
      const err = new Error("Not found");
      err.statusCode = 404;
      throw err;
    }

    if (hptRecord._id || hptRecord._owner) {
      delete hptRecord._id;
      delete hptRecord._owner;
    }

    res.json(hptRecord);
  } catch (e) {
    next(e);
  }
};

const addHptController = async (req, res, next) => {
  try {
    const { transport, toolType, serialNumber, imageURL, components } =
      req.body;
    const { vendiaClient } = req.app.locals;

    await vendiaClient.entities.hornetPowerTools.add({
      transport,
      toolType,
      serialNumber,
      imageURL,
      components,
    });

    res.json({ msg: "Success" });
  } catch (e) {
    next(e);
  }
};

const getHPTFromVendia = (serialNum, vendiaClient) => {
  return vendiaClient.entities.hornetPowerTools.list({
    filter: {
      serialNumber: {
        eq: serialNum,
      },
    },
  });
};

module.exports = {
  getHptBySNController,
  addHptController,
};
