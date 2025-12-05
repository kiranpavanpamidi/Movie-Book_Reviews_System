const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const jwt = require("jsonwebtoken");

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create a review
router.post("/", protect, async (req, res) => {
  const { itemId, title, comment, rating } = req.body;
  try {
    const review = await Review.create({
      user: req.user,
      itemId,
      title,
      comment,
      rating,
    });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get reviews for an item
router.get("/:itemId", async (req, res) => {
  try {
    const reviews = await Review.find({ itemId: req.params.itemId }).populate("user", "name");
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
