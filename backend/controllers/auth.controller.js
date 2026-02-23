const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, number, password, role, firebaseToken } = req.body;

    // 🔐 Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

    if (!decodedToken.phone_number.includes(number)) {
      return res.status(400).json({ message: "Phone number not verified" });
    }

    const existingUser = await User.findOne({ number });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, number, password, role });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerWithoutOTP = async (req, res) => {
  try {
    const { name, number, password, role = "user" } = req.body;

    const existingUser = await User.findOne({ number });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, number, password, role: "user" });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { number, password } = req.body;

    const user = await User.findOne({ number });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // We need password for comparison, so fetch full user separately
    const fullUser = await User.findOne({ number });

    const isMatch = await fullUser.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(fullUser),
      user: {
        _id: user._id,
        name: user.name,
        number: user.number,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
