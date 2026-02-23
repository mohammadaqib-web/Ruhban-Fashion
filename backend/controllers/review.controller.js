const Review = require("../models/review.model");
const Product = require("../models/product.model");

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;

  const review = await Review.create({
    user: req.user._id,
    product: req.params.productId,
    rating,
    comment,
  });

  const reviews = await Review.find({ product: req.params.productId });

  const avg =
    reviews.reduce((acc, item) => acc + item.rating, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(req.params.productId, {
    averageRating: avg,
    numReviews: reviews.length,
  });

  res.status(201).json(review);
};