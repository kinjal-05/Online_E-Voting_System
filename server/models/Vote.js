  const mongoose = require("mongoose");

  const VoteSchema = new mongoose.Schema(
    {
      voterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voter",
        required: true,
      },
      candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true,
      },
      electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true,
      },
      voteDate: {
        type: Date,
        default: Date.now,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true, 
    }
  );

  module.exports = mongoose.model("Vote", VoteSchema);
