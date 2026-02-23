const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { addReview } = require("../controllers/review.controller");

// Add review to product
router.post("/:productId", auth, addReview);

module.exports = router;
