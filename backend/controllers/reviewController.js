const Review = require("../models/Review");

// GET reviews for a movie
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ itemId: req.params.itemId })
      .populate("userId", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE review
exports.createReview = async (req, res) => {
  try {
    const { itemId, itemTitle, content, rating } = req.body;

    const review = await Review.create({
      userId: req.user.id,
      itemId,
      itemTitle,
      content,
      rating
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE review
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    review.content = req.body.content;
    review.rating = req.body.rating;
    review.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE review
exports.deleteReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (review.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LIKE
exports.likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    review.likes += 1;
    review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DISLIKE
exports.dislikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    review.dislikes += 1;
    review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
