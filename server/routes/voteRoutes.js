const express = require("express");
const router = express.Router();
const {  declareElectionResults } = require("../controllers/voteController");

const Vote = require("../models/Vote");
router.get("/votes/results/:electionId", declareElectionResults);

router.get("/vote-status/:voterId/:electionId", async (req, res) => {
    try {
      const { voterId, electionId } = req.params;
  
      // Check if a vote exists for this voter in this election
      const existingVote = await Vote.findOne({ voterId, electionId });
        console.log(existingVote);
      if (existingVote) {
        return res.json({ hasVoted: true, candidateId: existingVote.candidateId });
      } else {
        return res.json({ hasVoted: false });
      }
    } catch (error) {
      console.error("Error checking vote status:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
module.exports = router;
