const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const { getDashboardStats } = require("../controllers/admin.controller");

// Dashboard stats
router.get("/dashboard", auth, admin, getDashboardStats);

module.exports = router;
