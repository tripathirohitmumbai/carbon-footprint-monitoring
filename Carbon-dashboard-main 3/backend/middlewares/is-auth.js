const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const err = new Error("Authorization failed");
      err.statusCode = 401;
      throw err;
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY || "43sw3e5fgsx3fq3412"
    );

    if (!decodedToken) {
      const error = new HttpError("Authorization failed", 401);
      throw error;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { isAuth };
