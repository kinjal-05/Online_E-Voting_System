const mongoose = require("mongoose");
const Event = require("./Event");
const User = require("./User");

const CandidateSchema = new mongoose.Schema(
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
    party: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", 
      },
    ],
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
    paymentSuccess: {
      type: Boolean,
      required: true,
      default: false, 
    },
    
  },
  {
    timestamps: true, 
  }
);

CandidateSchema.pre("findOneAndDelete", async function (next) {
  try {
    const candidate = await this.model.findOne(this.getQuery()); 
    if (candidate && candidate.events.length > 0) {
      await Event.deleteMany({ _id: { $in: candidate.events } }); 
    }
    next();
  } catch (error) {
    console.error("Error deleting candidate events:", error);
    next(error);
  }
});

CandidateSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    if (this.events && this.events.length > 0) {
      await Event.deleteMany({ _id: { $in: this.events } });
    }
    next();
  } catch (error) {
    console.error("Error deleting candidate events:", error);
    next(error);
  }
});

module.exports = mongoose.model("Candidate", CandidateSchema);
