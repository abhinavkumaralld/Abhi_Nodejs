const mongoose = require("mongoose");

const ConnectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: "Users",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: "Users",
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: `{VALUE} is not valid`,
      },
    },
  },
  { timestamps: true }
);

ConnectionRequestSchema.pre("save", async function () {
  const currentRequest = this;
  if (this.fromUserId.toString() == this.toUserId.toString()) {
    throw new Error("Cannot send connection request to yourself from db!!");
  }
});
const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema
);

module.exports = ConnectionRequest;
