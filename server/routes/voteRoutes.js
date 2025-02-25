const express = require("express");
const router = express.Router();
const {  declareElectionResults } = require("../controllers/voteController");


router.get("/votes/results/:electionId", declareElectionResults);

module.exports = router;
