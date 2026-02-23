const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoriesAdmin,
} = require("../controllers/category.controller");
const upload = require("../middleware/upload.middleware");

router
  .route("/")
  .post(auth, admin, upload.single("image"), createCategory)
  .get(getCategories);

router.get("/admin", auth, admin, getCategoriesAdmin);

router
  .route("/:id")
  .put(auth, admin, upload.single("image"), updateCategory)
  .delete(auth, admin, deleteCategory);

module.exports = router;
