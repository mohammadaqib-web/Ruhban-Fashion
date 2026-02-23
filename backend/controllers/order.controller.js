const Order = require("../models/order.model");

// Create Order (User)
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, totalAmount, shippingAddress, payment } = req.body;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalAmount,
      shippingAddress,
      payment: {
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.paymentMethod === "cod" ? "pending" : "pending",
      },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
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
