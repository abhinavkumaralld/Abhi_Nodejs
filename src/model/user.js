const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 3,
    maxLength: 20,
  },
  emailId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) throw new Error("Enter a valid email");
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 200,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(v) {
      if (!["Male", "Female", "Other"].includes(v))
        throw new Error("Kindly give proper gender value");
    },
  },
  photoUrl: {
    type: String,
    minLength: 3,
    maxLength: 100,
    validate(val) {
      if (!validator.isURL(val))
        throw new Error("Kindly enter valid Photo URL");
    },
  },
  about: {
    type: String,
    default: "Hi, i am introvert",
    minLength: 3,
    maxLength: 200,
  },
  skills: {
    type: [String],
    validate(v) {
      if (v.length > 5) throw new Error("More than 5 skills are not allowed");
    },
  },
});

UserSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ token: this._id }, process.env.JWT_PASSWORD, {
    expiresIn: 60 * 60,
  });
  return token;
};
UserSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const isPasswordMatched = await bcrypt.compare(
    userInputPassword,
    this.password
  );
  return isPasswordMatched;
};

const Users = mongoose.model("Users", UserSchema);

module.exports = { Users };
