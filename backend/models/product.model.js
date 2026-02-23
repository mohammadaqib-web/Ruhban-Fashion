const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    // 🔥 Different pricing per size
    sizes: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        stock: { type: Number, required: true, default: 0 },
      },
    ],

    colors: [{ type: String }],

    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
