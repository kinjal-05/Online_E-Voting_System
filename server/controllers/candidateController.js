const Candidate = require("../models/Candidate");
const User = require("../models/User");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config(); 


sgMail.setApiKey("YOUR_SENDGROG_KEY");
const stripe = require("stripe")("YOUR_STRIPE_KEY"); 

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


const getCandidateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const candidate = await Candidate.findOne({ userId });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    return res.status(200).json(candidate);
  } catch (err) {
    console.error("Error in getCandidateByUserId:", err);
    return res.status(500).json({ message: "Server error while checking candidate status" });
  }
};



const updateCandidateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, party, district, state } = req.body;

    const updatedCandidate = await Candidate.findOneAndUpdate(
      { userId },
      { $set: { firstName, lastName, party, district, state } },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate profile:", error);
    res.status(500).json({ message: "Error updating candidate profile" });
  }
};


const getCandidateEvents = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!isValidObjectId(candidateId)) {
      return res.status(400).json({ message: "Invalid candidateId format" });
    }

    const candidate = await Candidate.findById(candidateId).populate("events");
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({ events: candidate.events });
  } catch (err) {
    console.error("Error fetching candidate events:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};


const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    return res.status(200).json(candidates);
  } catch (err) {
    console.error("Error fetching candidates:", err);
    return res.status(500).json({ message: "Error fetching candidates" });
  }
};


const deleteCandidate = async (req, res) => {
  const { candidateId } = req.params;

  if (!isValidObjectId(candidateId)) {
    return res.status(400).json({ message: "Invalid candidateId format" });
  }

  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
    if (!deletedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (err) {
    console.error("Error deleting candidate:", err);
    res.status(500).json({ message: "Error deleting candidate" });
  }
};












// Modify registerCandidate to check payment before registering
const registerCandidate = async (req, res) => {
  

    try {
      const { userId, firstName, lastName, party, district, state, faceDetection, aadhaarDetection,paymentSuccess } = req.body;

      if (!userId || !firstName || !lastName || !party || !district || !state) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid userId format" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingCandidate = await Candidate.findOne({ userId });
      if (existingCandidate) {
        return res.status(400).json({ message: "You are already registered as a candidate" });
      }

      if (faceDetection != 1) {
        return res.status(400).json({ message: "Face authentication failed. Please upload a valid image." });
      }

      if (aadhaarDetection != 1) {
        return res.status(400).json({ message: "Aadhaar authentication failed. Please upload a valid document." });
      }
      if(paymentSuccess==false)
      {
        return res.status(400).json({ message: "Payment is Remianing." });
        
      }
      // 🔹 Validate Payment
     

      const newCandidate = new Candidate({
        userId,
        firstName,
        lastName,
        party,
        district,
        state,
        events: [],
        faceDetection,
        aadhaarDetection,
        paymentSuccess
      });

      await newCandidate.save();

      // 🔹 Send Confirmation Email
      if (user.email) {
        const msg = {
          to: user.email,
          from: "bhavumistry08@gmail.com",
          subject: "Successful Candidate Registration",
          text: `Hello ${user.email},\n\nYou have successfully registered as a candidate in the eVoting System.`,
          html: `<p>Hello <strong>${user.email}</strong>,</p>
                 <p>You have successfully registered as a Candidate for ${newCandidate.party} in the eVoting System.</p>
                 <p>Best Regards,<br>SecureVote Support Team</p>`,
        };

        sgMail.send(msg).catch((err) => console.error("SendGrid Error:", err));
      }

      res.status(201).json({
        message: "Candidate registered successfully",
        candidate: newCandidate,
      });
    } catch (error) {
      console.error("Error in registerCandidate:", error);
      res.status(500).json({ message: "Server error while registering candidate" });
    }
};










module.exports = {
  getCandidateByUserId,
  registerCandidate,
  updateCandidateProfile,
  getCandidateEvents,
  getAllCandidates,
  deleteCandidate,
};
