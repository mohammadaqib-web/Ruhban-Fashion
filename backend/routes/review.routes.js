const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  addReview,
  getProductReviews,
} = require("../controllers/review.controller");

// Add review to product
router.post("/:productId", auth, addReview);
router.get("/:productId", getProductReviews);

module.exports = router;
