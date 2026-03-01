const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  updatePaymentStatus,
} = require("../controllers/order.controller");

router.post("/", auth, createOrder);
router.get("/my", auth, getMyOrders);
router.get("/", auth, admin, getAllOrders);
router.put("/:id", auth, admin, updateOrderStatus);
router.post("/razorpay/create", auth, createRazorpayOrder);
router.post("/razorpay/verify", auth, verifyRazorpayPayment);
router.put("/:id/payment-status", auth, admin, updatePaymentStatus);

module.exports = router;
