const mongoose = require("mongoose");

const VoterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    voted: {
      type: Boolean,
      default: false,
    },
    profile: {
      address: { type: String, required: true },
      phoneNumber: { type: String, required: true }
    },
    faceDetection: {
      type: Number,
      required: true,
      default: 0, 
    },
    aadhaarDetection: {
      type: Number, 
      required: true,
      default: 0, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Voter", VoterSchema);
