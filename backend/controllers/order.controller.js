const Order = require("../models/order.model");
const Razorpay = require("razorpay");
const Product = require("../models/product.model");
const crypto = require("crypto");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Order (User)
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, totalAmount, shippingAddress, payment } = req.body;

    // ✅ Only India
    if (shippingAddress.country !== "India") {
      return res.status(400).json({
        message: "We only deliver inside India",
      });
    }

    // ✅ COD only Ballia
    const isBallia = shippingAddress.city.toLowerCase() === "ballia";

    if (payment.paymentMethod === "cod" && !isBallia) {
      return res.status(400).json({
        message: "Cash on Delivery is available only in Ballia",
      });
    }

    // ✅ Check Stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);

      if (sizeIndex === -1) {
        return res.status(400).json({
          message: "Size not available",
        });
      }

      if (product.sizes[sizeIndex].stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      // Deduct stock
      product.sizes[sizeIndex].stock -= item.quantity;
      product.stock -= item.quantity;

      await product.save();
    }

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      totalAmount,
      shippingAddress,
      payment: {
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.paymentMethod === "cod" ? "pending" : "paid",
        paymentId: payment.paymentId || null,
        razorpayOrderId: payment.razorpayOrderId || null,
        razorpaySignature: payment.razorpaySignature || null,
        paidAt: payment.paymentMethod === "razorpay" ? Date.now() : null,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name number");
  res.json(orders);
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const newStatus = req.body.status;

    order.status = newStatus;

    // If delivered → set deliveredAt
    if (newStatus === "delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
