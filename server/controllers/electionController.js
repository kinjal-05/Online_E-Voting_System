

const Election = require("../models/Election"); 
const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");
const Vote = require("../models/Vote");
const User = require("../models/User");
const sgMail = require("@sendgrid/mail");
require('dotenv').config();
sgMail.setApiKey(process.env.YOUR_SENDGROG_KEY);
const stripe = require("stripe")(process.env.YOUR_STRIPE_KEY); 

const addElection = async (req, res) => {
  const { name, startDate, endDate, status, districts, resultsDeclared } = req.body;

  try {
  
    const newElection = new Election({
      name,
      startDate,
      endDate,
      status,
      districts,
      resultsDeclared,
    });

 
    await newElection.save();
    return res.status(201).json({ message: "Election added successfully!" });
  } catch (err) {
    console.error("Error adding election:", err);
    return res.status(500).json({ message: "Error adding election" });
  }
};
const getAllElections = async (req, res) => {
    try {
      const elections = await Election.find(); 
      console.log(elections);
      res.status(200).json(elections);
    } catch (err) {
      res.status(500).json({ message: "Error fetching elections" });
    }
  };
  
  const deleteElection = async (req, res) => {
    try {
      const electionId = req.params.id;
      const election = await Election.findByIdAndDelete(electionId);
      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }
      res.status(200).json({ message: 'Election deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting election' });
    }
  };
  

  const updateElection = async (req, res) => {
    try {
      const electionId = req.params.id;
      const updatedData = req.body; 
  
      const election = await Election.findByIdAndUpdate(electionId, updatedData, { new: true });
      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }
      res.status(200).json(election);
    } catch (err) {
      res.status(500).json({ message: 'Error updating election' });
    }
  };
const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const registerForElection = async (req, res) => {
  const { electionId, candidateId } = req.body;
  console.log(candidateId);

  try {
    
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found.' });
    }
    console.log(election);

    
    if (election.candidates.includes(candidateId)) {
      return res.status(200).json({ message: 'Candidate is already registered for this election.' });
    }

  
    election.candidates.push(candidateId);

  
    await election.save();
    
    let candidateDetails;
    try {
      candidateDetails = await Candidate.findById(candidateId); 
      if (!candidateDetails) {
        return res.status(404).json({ message: "Candidate not found in user records." });
      }
      console.log("Candidate Details from DB:", candidateDetails);
    } catch (dbError) {
      console.error("Error fetching candidate from database:", dbError);
      return res.status(500).json({ message: "Failed to fetch candidate details from database." });
    }

    let user;
    try {
      user = await User.findById(candidateDetails.userId); 
      if (!user) {
        return res.status(404).json({ message: "Candidate not found in user records." });
      }
      console.log("Candidate Details from DB:", candidateDetails);
    } catch (dbError) {
      console.error("Error fetching candidate from database:", dbError);
      return res.status(500).json({ message: "Failed to fetch candidate details from database." });
    }

    const msg = {
          to: user.email,
          from: "bhavumistry08@gmail.com", 
          subject: "Successful Register for Election",
          text: `Hello ${user.email},\n\nYou have successfully Register into your account.`,
          html: `<p>Hello <strong>${user.email}</strong>,</p>
                 <p>You have successfully Register into Evoting System for ${election.name} election.</p>
                 <p>Best Regards,<br>SecureVote Support Team</p>`,
        };
        sgMail.send(msg).catch((err) => console.error("SendGrid Error:", err));


        return res.status(200).json({ message: 'Candidate successfully registered for the election.' });
    
  } catch (error) {
    console.error('Error registering for election:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
const getCandidatesForElection = async (req, res) => {
  const { electionId } = req.params;

  try {
    
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found." });
    }

  
    const candidates = await Candidate.find({
      _id: { $in: election.candidates }, 
    });

    
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const voteForCandidate = async (req, res) => {
  
  const { candidateId,voterId,electionId} = req.body; 

  try {
    
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found." });
    }

   
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }


    const voter = await Voter.findById(voterId);
    if (!voter) {
      return res.status(404).json({ message: "Voter not found." });
    }

  
    if (election.status !== "active") {
      return res.status(400).json({ message: "This election is not active." });
    }

    
    const existingVote = await Vote.findOne({ voterId, electionId ,candidateId});
    if (existingVote) {
      return res.status(201).json({ message: "Voter has already voted in this election." });
    }

   
    const newVote = new Vote({
      voterId,
      candidateId,
      electionId,
      district: voter.district,
    });

    await newVote.save();
    let user;
    try {
      user = await User.findById(candidate.userId);
      if (!user) {
        return res.status(404).json({ message: "Candidate not found in user records." });
      }
      console.log("Candidate Details from DB:", candidate);
    } catch (dbError) {
      console.error("Error fetching candidate from database:", dbError);
      return res.status(500).json({ message: "Failed to fetch candidate details from database." });
    }

    const msg = {
          to: user.email,
          from: "bhavumistry08@gmail.com", 
          subject: "Successful voted Notification",
          text: `Hello ${user.email},\n\nYou have successfully voted.`,
          html: `<p>Hello <strong>${user.email}</strong>,</p>
                 <p>You have successfully give vote to ${candidate.firstName}.</p>
                 <p>Best Regards,<br>SecureVote Support Team</p>`,
        };
        sgMail.send(msg).catch((err) => console.error("SendGrid Error:", err));
 

    return res.status(200).json({ message: "Vote submitted successfully!" });
  } catch (error) {
    console.error("Error voting:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {addElection , getAllElections, deleteElection, updateElection,getElectionById,registerForElection,getCandidatesForElection ,voteForCandidate};
