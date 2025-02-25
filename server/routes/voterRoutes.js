const express = require("express");
const router = express.Router();
const voterController = require("../controllers/voterController");
const authMiddleware = require("../middleware/auth");

router.get("/votes/:userId", voterController.checkVoterStatus);


router.post("/voters/register", voterController.registerAsVoter);
router.post("/voter/register", voterController.registerVoter);
router.put("/votes/:id",  voterController.updateVoterProfile);
router.delete("/voters/:voterId", voterController.deleteVoter);
router.get("/voters", voterController.getVoters);
module.exports = router;
