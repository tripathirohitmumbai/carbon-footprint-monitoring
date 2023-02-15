const jwt = require("jsonwebtoken");

const loginUserController = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const err = new Error("Username or Password can't be empty");
      err.statusCode = 401;
      throw err;
    }

    const tkn = await authenticateUser(username, password);

    res.json({ authToken: tkn });
  } catch (e) {
    next(e);
  }
};

const authenticateUser = async (username, password) => {
  try {
    let isAdmin;

    if (username === "admin" && password === "admin123") {
      isAdmin = true;
    } else {
      if (username !== "user1") {
        const err = new Error("User does not exist");
        err.statusCode = 401;
        throw err;
      }

      if (password !== "password123") {
        const err = new Error("Invalid credentials!");
        err.statusCode = 401;
        throw err;
      }
    }

    const token = jwt.sign(
      {
        userId: username,
        privileges: isAdmin ? "admin" : "user",
      },
      process.env.SECRET_KEY,
      { expiresIn: "2w" }
    );

    return token;
  } catch (e) {
    throw e;
  }
};

module.exports = { loginUserController };
