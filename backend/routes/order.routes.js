const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

// Create order
router.post("/", auth, createOrder);

// Get my orders
router.get("/my", auth, getMyOrders);

// Admin: Get all orders
router.get("/", auth, admin, getAllOrders);

// Admin: Update order status
router.put("/:id", auth, admin, updateOrderStatus);

module.exports = router;
