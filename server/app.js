const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();


const User = require("./models/User");
const Voter = require("./models/Voter");
const Candidate = require("./models/Candidate");
const Election = require("./models/Election");
const Vote = require("./models/Vote");
const Event = require("./models/Event");
const aadhaar_records = require("./models/aadhaar_records");
const ElectionResult = require("./models/ElectionResult");
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const eventRoutes = require("./routes/eventRoutes");
const app = express();
const electionRoutes = require("./routes/electionRoutes");
const votersRoutes = require("./routes/voterRoutes");
const voterRoutes = require("./routes/voteRoutes");
const electionResultsRoute = require("./routes/electionResults");
const stripe = require('stripe')(process.env.YOUR_STRIPE_KEY);
require('dotenv').config();
app.use(express.json()); 
app.use(cors()); 


mongoose
  .connect(process.env.YOUR_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/api/users", userRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/voters", votersRoutes);
app.use("/api/votes", voterRoutes);
app.use("/api/election", electionResultsRoute);

app.get("/", (req, res) => {
  res.send("E-Voting System API is running...");
});
app.post('/api/payment-intent', async (req, res) => {
  try {
      const { amount } = req.body;

    
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, 
          currency: 'usd',
          payment_method_types: ['card'], 
      });

      res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
