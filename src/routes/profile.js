const express = require("express");
const { userAuth } = require("../middleware/auth");
const { editProfileValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { Users } = require("../model/user");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const userVal = req.user;
    res.send(userVal);
  } catch (e) {
    res.status(500).send("Something went wrong!! " + e.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = editProfileValidation(req);
    if (!isEditAllowed) throw new Error("Invalid Edit Fields!!");

    const loggedInUser = req.user[0];
    Object.keys(req.body).forEach((val) => (loggedInUser[val] = req.body[val]));
    await loggedInUser.save();
    res.send("User Updated successfully");
  } catch (e) {
    res.status(500).send("Something went wrong!! " + e.message);
  }
});

profileRouter.patch("/profile/editpassword", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user[0];
    const { emailId, oldPassword, newPassword } = req.body;

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      loggedInUser.password
    );
    if (!isOldPasswordCorrect) throw new Error("Old password not correct!!");
    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();
    res.send("Password Updated successfully");
  } catch (e) {
    res.status(500).send("Something went wrong!! " + e.message);
  }
});
module.exports = { profileRouter };
