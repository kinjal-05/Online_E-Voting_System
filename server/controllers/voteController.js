const mongoose = require("mongoose");
const Vote = require("../models/Vote");
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");
const ElectionResult = require("../models/ElectionResult");
const User = require("../models/User");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("YOUR_SENDGROG_KEY");
const stripe = require("stripe")("YOUR_STRIPE_KEY"); 

exports.declareElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;
    const electionObjectId = new mongoose.Types.ObjectId(electionId);

    
    const results = await Vote.aggregate([
      { $match: { electionId: electionObjectId } },
      { $group: { _id: "$candidateId", voteCount: { $sum: 1 } } },
      { $sort: { voteCount: -1 } },
      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "_id",
          as: "candidateDetails",
        },
      },
      { $unwind: "$candidateDetails" },
      {
        $project: {
          _id: 1,
          voteCount: 1,
          "candidateDetails.firstName": 1,
          "candidateDetails.lastName": 1,
          "candidateDetails.party": 1,
          "candidateDetails.userId": 1, 
        },
      },
    ]);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No votes found for this election." });
    }

    const winner = results[0];

    await ElectionResult.create({
      electionId: electionObjectId,
      candidateId: winner._id,
      candidateName: `${winner.candidateDetails.firstName} ${winner.candidateDetails.lastName}`,
      party: winner.candidateDetails.party,
      votes: winner.voteCount,
    });

  
    await Election.findByIdAndUpdate(electionId, { resultsDeclared: true, results: [winner] });

   
    try {
      const user = await User.findById(winner.candidateDetails.userId);
      if (user && user.email) {
        const msg = {
          to: user.email,
          from:"bhavumistry08@gmail.com",
          subject: "Election Results Declared",
          text: `Hello ${winner.candidateDetails.firstName},\n\nCongratulations! You won the election with ${winner.voteCount} votes.`,
          html: `<p>Hello <strong>${winner.candidateDetails.firstName}</strong>,</p>
                 <p>Congratulations! You won the election with <strong>${winner.voteCount}</strong> votes.</p>
                 <p>Best Regards,<br>SecureVote Support Team</p>`,
        };
        await sgMail.send(msg);
        console.log(`Email sent to ${user.email}`);
      } else {
        console.error(`User not found or email missing for candidate: ${winner._id}`);
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    res.status(200).json({ message: "Results declared successfully.", winner });
  } catch (error) {
    console.error("Error declaring election results:", error);
    res.status(500).json({ message: "Error declaring election results", error: error.message });
  }
};
