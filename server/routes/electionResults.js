const express = require("express");
const router = express.Router();
const { getElectionResults } = require("../controllers/electionResultsController"); 


router.get("/election-results", getElectionResults);

module.exports = router;
