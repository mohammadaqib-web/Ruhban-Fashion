const Product = require("../models/product.model");
const Category = require("../models/category.model");
const cloudinary = require("../config/cloudinary");

// Helper: Upload image to cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(fileBuffer);
  });
};

// ===============================
// Create Product (Admin)
// ===============================
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, sizes, colors, isFeatured, isActive } =
      req.body;

    if (!name || !description || !category || !sizes) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product images required" });
    }

    const parsedSizes = JSON.parse(sizes);
    const parsedColors = colors ? JSON.parse(colors) : [];

    if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
      return res.status(400).json({ message: "At least one size required" });
    }

    // Validate each size
    for (let sizeObj of parsedSizes) {
      if (!sizeObj.size || !sizeObj.price || sizeObj.stock === undefined) {
        return res.status(400).json({
          message: "Each size must have size, price and stock",
        });
      }
    }

    // Upload images
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);
        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }),
    );

    const product = await Product.create({
      name,
      description,
      category,
      sizes: parsedSizes,
      colors: parsedColors,
      images: uploadedImages,
      isFeatured: isFeatured === "true",
      isActive: isActive !== "false",
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// Update Product (Admin)
// ===============================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, category, sizes, colors, isFeatured, isActive } =
      req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
      product.category = category;
    }

    // If new images uploaded
    if (req.files && req.files.length > 0) {
      await Promise.all(
        product.images.map((img) => cloudinary.uploader.destroy(img.public_id)),
      );

      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);
          return {
            url: result.secure_url,
            public_id: result.public_id,
          };
        }),
      );

      product.images = uploadedImages;
    }

    if (name) product.name = name;
    if (description) product.description = description;

    if (sizes) {
      const parsedSizes = JSON.parse(sizes);

      for (let sizeObj of parsedSizes) {
        if (!sizeObj.size || !sizeObj.price || sizeObj.stock === undefined) {
          return res.status(400).json({
            message: "Each size must have size, price and stock",
          });
        }
      }

      product.sizes = parsedSizes;
    }

    if (colors) product.colors = JSON.parse(colors);

    if (isFeatured !== undefined) product.isFeatured = isFeatured === "true";

    if (isActive !== undefined) product.isActive = isActive === "true";

    await product.save();

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// Delete Product (Admin)
// ===============================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images in parallel
    await Promise.all(
      product.images.map((img) => cloudinary.uploader.destroy(img.public_id)),
    );

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// Get All Products (Admin)
// ===============================
exports.getProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Admin Products Error:", error);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};
