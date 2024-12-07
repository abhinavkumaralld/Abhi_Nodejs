const jwt = require("jsonwebtoken");
const { Users } = require("../model/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("No token found");
    const decodedData = jwt.verify(token, process.env.JWT_PASSWORD);
    if (!decodedData) throw new Error("No token found");
    const user = await Users.find({ _id: decodedData?.token });
    req.user = user;
    next();
  } catch (e) {
    res.status(500).send("Something went wrong in!! " + e.message);
  }
};

module.exports = { userAuth };
