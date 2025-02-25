const ElectionResult = require("../models/ElectionResult"); 


const getElectionResults = async (req, res) => {
  try {
    const results = await ElectionResult.find()
      .populate("candidateId", "firstName lastName") 
      .populate("electionId", "name startDate endDate"); 

    if (!results.length) {
      return res.status(404).json({ message: "No results found." });
    }

    res.json(results); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching election results." });
  }
};

module.exports = { getElectionResults };
