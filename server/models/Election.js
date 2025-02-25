const mongoose = require("mongoose");
const Candidate = require("./Candidate");
const ElectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      required: true,
    },
    districts: {
      type: [String], 
      required: true,
    },
    resultsDeclared: {
      type: Boolean,
      default: false,
    },
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate", 
        required: true,
      },
    ],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Election", ElectionSchema);
