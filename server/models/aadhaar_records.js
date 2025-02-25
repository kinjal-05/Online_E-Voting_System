const mongoose = require("mongoose");
const User = require("./User");
const aadhaar_recordsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  aadhaar_number: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("aadhaar_records", aadhaar_recordsSchema);
