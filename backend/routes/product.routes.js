const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsAdmin,
  getProducts,
  getProductsByCategory,
  getSingleProduct,
  searchProducts,
  getRandomProducts,
} = require("../controllers/product.controller");

router.get("/user", getProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/", auth, admin, upload.array("images", 5), createProduct);
router.get("/", auth, admin, getProductsAdmin);
router.get("/search", searchProducts);
router.get("/random", getRandomProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", auth, admin, upload.array("images", 5), updateProduct);
router.delete("/:id", auth, admin, deleteProduct);

module.exports = router;
