const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middleware/auth");
const { Users } = require("../model/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new Users({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });
    await user.save();
    res.send("User saved successfully");
  } catch (e) {
    res.status(500).send("Something went wrong!! " + e.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const result = await Users.findOne({ emailId: emailId });

    if (result) {
      const isPasswordMatched = await result.validatePassword(password);
      if (isPasswordMatched) {
        const jwtToken = await result.getJWT();
        res.cookie("token", jwtToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60), // 1h
        });
        res.send("Login successfull");
      } else throw new Error("Invalid credential !!");
    } else throw new Error("Invalid credential !!");
  } catch (e) {
    res.status(500).send("Something went wrong!! " + e.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged out successfully");
  } catch (e) {
    res.status(500).send("Something went wrong!! " + e.message);
  }
});
module.exports = { authRouter };
