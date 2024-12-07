const express = require("express");
const { Users } = require("../model/user");
const ConnectionRequest = require("../model/connectionRequest");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const mongoose = require("mongoose");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const toUserId = req.params.toUserId;
      const user = req.user[0];
      const fromUserId = user._id;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status))
        return res.status(400).json({
          message: "status is not valid : " + status,
        });

      const toUser = await Users.findById(toUserId);
      if (!toUser)
        return res.status(400).json({
          message: "toUser does not exist!!",
        });

      const isRequestAlreadyExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (isRequestAlreadyExist)
        return res.status(400).json({
          message: "Connections already sent!!",
        });
      const connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status: status,
      });
      await connectionRequest.save();

      res.json({
        message: "Request sent successfully",
      });
    } catch (e) {
      res.status(500).send("Something went wrong!! " + e.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const requestId = req.params.requestId;
      const user = req.user[0];

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status not allowed!!",
        });
      }
      const ConnRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });
      if (!ConnRequest) {
        return res.status(400).json({
          message: "Connection request not found!!",
        });
      }
      ConnRequest.status = status;
      await ConnRequest.save();

      res.json({
        message: "Request accepted successfully",
      });
    } catch (e) {
      res.status(500).send("Something went wrong!! " + e.message);
    }
  }
);
module.exports = { requestRouter };
