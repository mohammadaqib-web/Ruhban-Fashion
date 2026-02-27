const Review = require("../models/review.model");
const Product = require("../models/product.model");
const { default: mongoose } = require("mongoose");

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // 🔍 Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      product: req.params.productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // ✅ Create new review
    const review = await Review.create({
      user: req.user.id,
      product: req.params.productId,
      rating,
      comment,
    });

    // 📊 Recalculate rating
    const reviews = await Review.find({
      product: req.params.productId,
    });

    const avg =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(req.params.productId, {
      averageRating: avg,
      numReviews: reviews.length,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
