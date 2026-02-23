const express = require("express");
const router = express.Router();
const {
  register,
  login,
  changePassword,
} = require("../controllers/auth.controller");
const { registerWithoutOTP } = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/registerWithoutOTP", registerWithoutOTP);
router.post("/login", login);
router.put("/change-password", auth, changePassword);

module.exports = router;
