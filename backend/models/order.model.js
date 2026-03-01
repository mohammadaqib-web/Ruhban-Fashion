const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        size: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: {
        type: String,
        default: "India",
      },
    },

    payment: {
      paymentMethod: {
        type: String,
        enum: ["razorpay", "cod"],
        required: true,
      },

      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },

      paymentId: String, // razorpay_payment_id

      razorpayOrderId: String, // razorpay_order_id

      razorpaySignature: String, // for verification

      paidAt: Date,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    deliveredAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
