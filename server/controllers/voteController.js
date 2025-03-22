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

    // Fetch election details separately
    const election = await Election.findById(electionObjectId);
    if (!election) {
      return res.status(404).json({ message: "Election not found." });
    }

    // Aggregate results for all candidates
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

    // Extract election name
    const electionName = election.name;

    // Save all candidates' results in ElectionResult collection
    const electionResults = results.map(result => ({
      electionId: electionObjectId,
      name: electionName,
      candidateId: result._id,
      candidateName: `${result.candidateDetails.firstName} ${result.candidateDetails.lastName}`,
      party: result.candidateDetails.party,
      votes: result.voteCount,
    }));

    await ElectionResult.insertMany(electionResults);

    // Save results in the Election collection
    await Election.findByIdAndUpdate(electionId, { 
      resultsDeclared: true, 
      results: electionResults 
    });

    // Get the winner (first candidate in sorted results)
    const winner = results[0];

    // Send email to the winner
    try {
      const user = await User.findById(winner.candidateDetails.userId);
      if (user && user.email) {
        const msg = {
          to: user.email,
          from: "bhavumistry08@gmail.com",
          subject: "Election Results Declared",
          text: `Hello ${winner.candidateDetails.firstName},\n\nCongratulations! You won the ${electionName} election with ${winner.voteCount} votes.`,
          html: `<p>Hello <strong>${winner.candidateDetails.firstName}</strong>,</p>
                 <p>Congratulations! You won the <strong>${electionName}</strong> election with <strong>${winner.voteCount}</strong> votes.</p>
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

    res.status(200).json({ 
      message: "Results declared successfully.", 
      electionName: electionName,
      results: electionResults 
    });

  } catch (error) {
    console.error("Error declaring election results:", error);
    res.status(500).json({ message: "Error declaring election results", error: error.message });
  }
};



