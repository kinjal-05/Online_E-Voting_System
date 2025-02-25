const express = require("express");
const { getCandidateByUserId, registerCandidate,updateCandidateProfile,getCandidateEvents,deleteCandidate,getAllCandidates  } = require("../controllers/candidateController");
const protect = require('../middleware/auth');
const router = express.Router();
router.get('/candidates', getAllCandidates);

router.get("/candidates/:userId", getCandidateByUserId);
router.delete('/candidates/:candidateId', deleteCandidate);

router.post("/candidates/register", registerCandidate);
router.put("/candidates/:userId", updateCandidateProfile);
router.get("/candidates/:candidateId/events", getCandidateEvents);

module.exports = router;    
