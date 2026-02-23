const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

exports.getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: "Paid" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: revenueData[0]?.totalRevenue || 0,
  });
};