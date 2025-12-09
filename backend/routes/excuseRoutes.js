// backend/routes/excuseRoutes.js
const express = require("express");
const PDFDocument = require("pdfkit");
const { sendProofEmail } = require("../utils/emailService");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const Excuse = require("../models/Excuse");
const {
  generateExcuse,
  generateProof,
  generateApology,
  predictNextTime
} = require("../utils/excuseLogic");


const router = express.Router();

// POST /api/excuses/generate
router.post("/generate", protect, async (req, res) => {
  const { scenario, urgency } = req.body;

  try {
    // find authenticated user details
    const user = await User.findById(req.user._id);

    const text = generateExcuse(scenario, urgency || "normal");
    if (!text) {
      return res.status(400).json({ message: "Invalid scenario" });
    }

    // save excuse in DB
    const excuse = await Excuse.create({
      user: req.user._id,
      scenario,
      urgency: urgency || "normal",
      text
    });

    // ⬇ pass username to proof so certificate includes real name
    const proof = generateProof(text, scenario, user.name);

    const apology = generateApology(scenario);

    // prediction update
    const last = await Excuse.findOne({ user: req.user._id }).sort({
      createdAt: -1
    });
    const prediction = last ? predictNextTime(last.createdAt) : null;

    res.json({
      excuse,
      proof,
      apology,
      username: user.name,   // ⬅ needed for PDF download
      scenario: scenario,    // ⬅ needed for naming PDF
      prediction
    });

  } catch (error) {
    console.error("Generate excuse error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/excuses/history
router.get("/history", protect, async (req, res) => {
  try {
    const items = await Excuse.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.json(items);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/excuses/favorite
router.post("/favorite", protect, async (req, res) => {
  const { excuseId, favorite } = req.body;

  try {
    const excuse = await Excuse.findOne({
      _id: excuseId,
      user: req.user._id
    });

    if (!excuse) {
      return res.status(404).json({ message: "Excuse not found" });
    }

    excuse.favorite = favorite ?? true;
    await excuse.save();

    res.json(excuse);
  } catch (error) {
    console.error("Favorite error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/excuses/favorites
router.get("/favorites", protect, async (req, res) => {
  try {
    const items = await Excuse.find({
      user: req.user._id,
      favorite: true
    }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Favorites error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/excuses/rate
router.post("/rate", protect, async (req, res) => {
  const { excuseId, rating } = req.body;

  try {
    const excuse = await Excuse.findOne({
      _id: excuseId,
      user: req.user._id
    });

    if (!excuse) {
      return res.status(404).json({ message: "Excuse not found" });
    }

    excuse.rating = rating;
    await excuse.save();

    res.json(excuse);
  } catch (error) {
    console.error("Rate error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/excuses/best
router.get("/best", protect, async (req, res) => {
  try {
    const best = await Excuse.find({
      user: req.user._id,
      rating: { $ne: null }
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(1);

    if (!best.length) {
      return res.json({ message: "No ratings yet." });
    }

    res.json(best[0]);
  } catch (error) {
    console.error("Best error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/excuses/prediction
router.get("/prediction", protect, async (req, res) => {
  try {
    const last = await Excuse.findOne({ user: req.user._id }).sort({
      createdAt: -1
    });

    if (!last) {
      return res.json({
        message: "Not enough data yet. Generate a few excuses first!"
      });
    }

    const next = predictNextTime(last.createdAt);

    res.json({ message: `Next likely excuse needed around: ${next}` });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/excuses/send-proof-email
router.post("/send-proof-email", protect, async (req, res) => {
  try {
    const { excuseId } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const excuse = await Excuse.findOne({ _id: excuseId, user: req.user._id });
    if (!excuse) return res.status(404).json({ message: "Excuse not found" });

    // Rebuild professional proof text with user name
    const proofText = generateProof(excuse.text, excuse.scenario, user.name);

    // Create PDF in memory using pdfkit
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      const filename = `${excuse.scenario}_${user.name.replace(/ /g, "_")}.pdf`;

      await sendProofEmail({
        to: user.email, // assumes your User model has "email"
        subject: "Your AI Excuse Certificate",
        text: "Attached is your excuse certificate generated by the AI Excuse Generator.",
        pdfBuffer,
        filename
      });

      res.json({ message: "Email sent successfully" });
    });

    doc.fontSize(12).text(proofText, {
      align: "left",
      width: 500
    });

    doc.end();
  } catch (err) {
    console.error("Send-proof-email error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
