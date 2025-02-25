

const express = require("express");
const router = express.Router();
const { addElection,getAllElections,deleteElection ,updateElection,getElectionById,registerForElection,getCandidatesForElection,voteForCandidate} = require("../controllers/electionController"); 


router.post("/elections", addElection);
router.get("/elections", getAllElections);
router.get("/elections/:id", getElectionById);

router.delete("/elections/:id", deleteElection);
router.post("/vote/:electionId",voteForCandidate);

router.put("/elections/:id", updateElection);
router.post("/elections/register", registerForElection);
router.get("/candidates/:electionId", getCandidatesForElection);


module.exports = router;
