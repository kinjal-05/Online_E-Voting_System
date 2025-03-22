const Voter = require("../models/Voter");
const mongoose = require("mongoose");
const User = require("../models/User"); 
const sgMail = require("@sendgrid/mail");
require('dotenv').config();
sgMail.setApiKey(process.env.YOUR_SENDGROG_KEY);
const stripe = require("stripe")(process.env.YOUR_STRIPE_KEY); 

exports.checkVoterStatus = async (req, res) => {
  try {
    const userId = req.params.userId;

  
    const voter = await Voter.findOne({ userId });

    if (voter) {
      return res.status(200).json(voter);
    }

    return res.status(404).json({ message: "User is not registered as a voter" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.registerAsVoter = async (req, res) => {
  try {
    const { userId, otherDetails } = req.body;


    const existingVoter = await Voter.findOne({ userId });
    console.log(existingVoter);
    if (existingVoter) {
      return res.status(400).json({ message: "User is already registered as a voter" });
    }

  
    const newVoter = new Voter({
      userId,
      otherDetails, 
    });

    await newVoter.save();
    return res.status(201).json({ message: "User successfully registered as a voter", voter: newVoter });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
exports.registerVoter = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { userId, firstName, lastName, dob, district, state, profile,faceDetection,aadhaarDetection } = req.body;

        
        const address = profile?.address;
        const phoneNumber = profile?.phoneNumber;

        
        if (!userId || !firstName || !lastName || !dob || !district || !state || !address || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required." });
        }


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

  
        const existingVoter = await Voter.findOne({ userId });
        if (existingVoter) {
            return res.status(400).json({ message: "You are already registered as a voter." });
        }
        if (faceDetection !== 1) {
          return res.status(400).json({ message: "Face authentication failed. Please upload a valid image." });
        }
        if (aadhaarDetection != 1) {
          return res.status(400).json({ message: "Face authentication failed. Please upload a valid image." });
        }
      
        const voter = new Voter({
            userId,
            firstName,
            lastName,
            dob,
            district,
            state,
            profile: { address, phoneNumber }, 
            faceDetection,
            aadhaarDetection,
        });

        await voter.save();
         const msg = {
              to: user.email,
              from: "bhavumistry08@gmail.com", 
              subject: "Successful Register Notification",
              text: `Hello ${user.email},\n\nYou have successfully Register into your account.`,
              html: `<p>Hello <strong>${user.email}</strong>,</p>
                     <p>You have successfully Register into Evoting System as voter.</p>
                     <p>Best Regards,<br>SecureVote Support Team</p>`,
            };
            sgMail.send(msg).catch((err) => console.error("SendGrid Error:", err));
        res.status(201).json({ message: "Voter registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
exports.updateVoterProfile = async (req, res) => {
    try {
      const voter = await Voter.findById(req.params.id);
      if (!voter) {
        return res.status(404).json({ message: "Voter not found" });
      }
  

      voter.firstName = req.body.firstName || voter.firstName;
      voter.lastName = req.body.lastName || voter.lastName;
      voter.dob = req.body.dob || voter.dob;
      voter.district = req.body.district || voter.district;
      voter.state = req.body.state || voter.state;
      voter.profile.address = req.body.profile.address || voter.profile.address;
      voter.profile.phoneNumber = req.body.profile.phoneNumber || voter.profile.phoneNumber;
  

      await voter.save();
      res.json({ message: "Profile updated successfully", voter });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.getVoters = async (req, res) => {
    try {
      const voters = await Voter.find();
      console.log(voters); 
      res.status(200).json(voters);
    } catch (error) {
      console.error("Error fetching voters:", error);
      res.status(500).json({ message: "Error fetching voters" });
    }
  };

  exports.deleteVoter = async (req, res) => {
    const { voterId } = req.params; 
    console.log( voterId);
  
  
    if (!mongoose.Types.ObjectId.isValid(voterId)) {
      return res.status(400).json({ message: "Invalid voter ID format" });
    }
  
    try {
      const voter = await Voter.findById(voterId); 
      if (!voter) {
        return res.status(404).json({ message: "Voter not found" });
      }
  
      
      await Voter.findByIdAndDelete(voterId);
      res.status(200).json({ message: "Voter deleted successfully" });
    } catch (error) {
      console.error("Error deleting voter:", error);
      res.status(500).json({ message: "Error deleting voter" });
    }
  };
