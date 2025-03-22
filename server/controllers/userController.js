const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");
const User = require("../models/User"); 
const Voter = require("../models/Voter");
const Vote = require("../models/Vote"); 
const Candidate = require("../models/Candidate"); 
const aadhaar_records = require("../models/aadhaar_records");
dotenv.config();
sgMail.setApiKey(process.env.YOUR_SENDGROG_KEY);
const stripe = require("stripe")(process.env.YOUR_STRIPE_KEY); 

exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

    
    const user = new User({
      email,
      passwordHash: hashedPassword,
      role,
    });

  
    await user.save();
    const msg = {
      to: user.email,
      from: "bhavumistry08@gmail.com", 
      subject: "Successful Register Notification",
      text: `Hello ${user.email},\n\nYou have successfully Register into your account.`,
      html: `<p>Hello <strong>${user.email}</strong>,</p>
             <p>You have successfully Register into Evoting System as ${user.role}.</p>
             <p>Best Regards,<br>SecureVote Support Team</p>`,
    };
    sgMail.send(msg).catch((err) => console.error("SendGrid Error:", err));

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

  
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'f5a6eac9029edb34849b110f6c5ad0b4c98de49e3d79bb7d49785e84902e4975e7', 
      { expiresIn: "1h" } 
    );
    console.log(user.email);

    const msg = {
      to: user.email,
      from:"bhavumistry08@gmail.com", 
      subject: "Successful Login Notification",
      text: `Hello ${user.email},\n\nYou have successfully logged into your account.`,
      html: `<p>Hello <strong>${user.email}</strong>,</p>
             <p>You have successfully logged into Evoting System as ${user.role}.</p>
             <p>Best Regards,<br>SecureVote Support Team</p>`,
    };
    sgMail.send(msg).catch((err) => console.error("SendGrid Error:", err));
    
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        role: user.role,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ message: "Server error while fetching admins" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const voterId = req.params.id;

 
    const user = await User.findById(voterId);
    if (!user) {
      return res.status(404).json({ message: "Voter not found" });
    }
    await aadhaar_records.deleteOne({ user_id: voterId});
   
 
    await Voter.findOneAndDelete({ userId: user._id });

 
    await Candidate.findOneAndDelete({ userId: user._id });
    
    
     

    const msg = {
      to: user.email,
      from: "bhavumistry08@gmail.com", 
      subject: "Successful Deletion",
      text: `Hello ${user.email},\n\nYou have permenantly Delete your account.`,
      html: `<p>Hello <strong>${user.email}</strong>,</p>
             <p>Best Regards,<br>SecureVote Support Team</p>`,
    };
    sgMail.send(msg).catch((err) => console.error("SendGrid Error:", err));

    await User.findByIdAndDelete(voterId);

    res.status(200).json({ message: "Voter account and associated records deleted successfully" });
  } catch (error) {
    console.error("Error deleting voter:", error);
    res.status(500).json({ message: "Server error while deleting voter account" });
  }
};
