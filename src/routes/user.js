const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");
const { Users } = require("../model/user");
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user[0];
    const recievedRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ]);
    return res.json({
      message: "Data fetched successfully",
      data: recievedRequests,
    });
  } catch (e) {
    res.status(500).send("Something went wrong!! " + e.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user[0];
    const acceptedRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "gender",
        "photoUrl",
        "about",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "gender",
        "photoUrl",
        "about",
        "skills",
      ]);
    const response = [];
    acceptedRequests?.map((val) => {
      if (val?.fromUserId._id.toString() == loggedInUser._id.toString()) {
        response.push(val.toUserId);
      } else response.push(val.fromUserId);
    });
    return res.json({
      message: "Data fetched successfully",
      data: response,
    });
  } catch (e) {
    res.status(500).send("Something went wrong!! " + e.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user[0];
    const page = req.query.page || 1;
    let limit = req.query.limit || 5;
    limit = limit > 50 ? 10 : limit;

    const feedConn = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    let set = new Set();
    set.add(loggedInUser._id);
    feedConn?.map((v) => {
      set.add(v?.fromUserId);
      set.add(v?.toUserId);
    });
    const feedUsers = await Users.find({
      _id: { $nin: Array.from(set) },
    })
      .skip((page - 1) * limit)
      .limit(limit);
    return res.json({
      message: "Data fetched successfully",
      data: feedUsers,
    });
  } catch (e) {
    res.status(500).send("Something went wrong!! " + e.message);
  }
});
module.exports = userRouter;
