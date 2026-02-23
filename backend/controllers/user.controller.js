const User = require("../models/user.model");

// ✅ Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single User
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -__v");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update User (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, number, address, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.name = name ?? user.name;
    user.number = number ?? user.number;
    // user.role = role ?? user.role;
    user.address = address ?? user.address;

    if (typeof isActive === "boolean") {
      user.isActive = isActive;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        number: user.number,
        role: user.role,
        address: user.address,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete User (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
