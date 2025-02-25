const mongoose = require("mongoose");
const aadhaar_records = require("./aadhaar_records");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "voter", "candidate"],
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);
UserSchema.pre("findByIdAndDelete", async function (next) {
  try {
    await aadhaar_records.deleteOne({ user_id: this._id });
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("User", UserSchema);
