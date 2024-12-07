const express = require("express");
const { dbConnect } = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth");
const { requestRouter } = require("./routes/request");
const { profileRouter } = require("./routes/profile");
const userRouter = require("./routes/user");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
dbConnect()
  .then((data) => {
    console.log("db connected successfully");
    app.listen("3000", () => {
      console.log("listen on port 3000");
    });
  })
  .catch((e) => {
    console.log("error while connecting with database", e);
  });
