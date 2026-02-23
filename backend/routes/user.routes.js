const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

// Admin Routes
router.get("/", auth, admin, getAllUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, admin, deleteUser);

module.exports = router;
