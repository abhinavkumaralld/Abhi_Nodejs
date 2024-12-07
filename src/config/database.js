const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = async () => {
  return await mongoose.connect(process.env.DATABASE);
};

module.exports = { dbConnect };
