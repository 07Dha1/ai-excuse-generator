// backend/models/Excuse.js
const mongoose = require("mongoose");

const excuseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scenario: { type: String, required: true }, // Work / School / Social / Family
    text: { type: String, required: true },
    urgency: { type: String, default: "normal" }, // normal / urgent
    rating: { type: Number, default: null },
    favorite: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Excuse", excuseSchema);
