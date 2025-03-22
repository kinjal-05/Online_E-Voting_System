const mongoose = require("mongoose");
const Election = require("./Election");
const Candidate = require("./Candidate");
const electionResultSchema = new mongoose.Schema({
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  candidateName: { type: String, required: true },
  party: { type: String, required: true },
  name:{type: String, required: true},
  votes: { type: Number, required: true },
});

module.exports = mongoose.model("ElectionResult", electionResultSchema);
