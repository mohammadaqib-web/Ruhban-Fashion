const Product = require("../models/product.model");
const Category = require("../models/category.model");
const cloudinary = require("../config/cloudinary");
const { default: mongoose } = require("mongoose");

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
    const productCount = await Product.countDocuments();
    if (productCount >= 100) {
      return res.status(400).json({
        message: "Product limit reached (Maximum 100 products allowed)",
      });
    }

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

    const { deletedImages } = req.body;

    // 1️⃣ Delete selected images
    if (deletedImages) {
      const parsedDeleted = JSON.parse(deletedImages);

      const imagesToDelete = product.images.filter((img) =>
        parsedDeleted.includes(img.url),
      );

      await Promise.all(
        imagesToDelete.map((img) => cloudinary.uploader.destroy(img.public_id)),
      );

      product.images = product.images.filter(
        (img) => !parsedDeleted.includes(img.url),
      );
    }

    // 2️⃣ Upload new images
    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);
          return {
            url: result.secure_url,
            public_id: result.public_id,
          };
        }),
      );

      product.images = [...product.images, ...uploadedImages];
    }

    // 3️⃣ Limit images to 5
    if (product.images.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 images allowed",
      });
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

// ===============================
// Get All Products (User)
// ===============================
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { minPrice, maxPrice, category, inStock } = req.query;

    const query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Build size filter
    if (minPrice || maxPrice || inStock === "true") {
      query.sizes = {
        $elemMatch: {
          ...(minPrice || maxPrice
            ? {
                price: {
                  $gte: parseInt(minPrice) || 0,
                  $lte: parseInt(maxPrice) || 999999,
                },
              }
            : {}),
          ...(inStock === "true" ? { stock: { $gt: 0 } } : {}),
        },
      };
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// ===============================
// Get Products By Category (User)
// ===============================
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { minPrice, maxPrice, inStock } = req.query;

    let categoryDoc;

    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      categoryDoc = await Category.findById(category);
    } else {
      categoryDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${category}$`, "i") },
      });
    }

    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const query = {
      category: categoryDoc._id,
      isActive: true,
    };

    if (minPrice || maxPrice || inStock === "true") {
      query.sizes = {
        $elemMatch: {
          ...(minPrice || maxPrice
            ? {
                price: {
                  $gte: parseInt(minPrice) || 0,
                  $lte: parseInt(maxPrice) || 999999,
                },
              }
            : {}),
          ...(inStock === "true" ? { stock: { $gt: 0 } } : {}),
        },
      };
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      category: categoryDoc.name,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    });
  } catch (error) {
    console.error("Get Products By Category Error:", error);
    res.status(500).json({
      message: "Failed to fetch category products",
    });
  }
};

// ===============================
// Get Single Product Detail
// ===============================
exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    }).populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Single Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(200).json({
        success: true,
        products: [],
      });
    }

    const products = await Product.find({
      isActive: true,
      name: { $regex: keyword, $options: "i" },
    })
      .select("name images")
      .limit(10);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

exports.getRandomProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const { minPrice, maxPrice, category, inStock } = req.query;

    const matchQuery = { isActive: true };

    if (category) {
      matchQuery.category = mongoose.Types.ObjectId(category);
    }

    if (minPrice || maxPrice || inStock === "true") {
      matchQuery.sizes = {
        $elemMatch: {
          ...(minPrice || maxPrice
            ? {
                price: {
                  $gte: parseInt(minPrice) || 0,
                  $lte: parseInt(maxPrice) || 999999,
                },
              }
            : {}),
          ...(inStock === "true" ? { stock: { $gt: 0 } } : {}),
        },
      };
    }

    const randomProducts = await Product.aggregate([
      { $match: matchQuery },
      { $sample: { size: limit } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          name: 1,
          slug: 1,
          images: 1,
          sizes: 1,
          category: { name: 1 },
          createdAt: 1,
        },
      },
    ]);

    res.json({
      success: true,
      total: randomProducts.length,
      products: randomProducts,
    });
  } catch (error) {
    console.error("Get Random Products Error:", error);
    res.status(500).json({
      message: "Failed to fetch random products",
    });
  }
};

exports.validateCart = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.json([]);
    }

    const validatedItems = [];

    for (const cartItem of items) {
      const product = await Product.findById(cartItem.productId);

      if (!product) continue;

      const sizeData = product.sizes.find(
        (s) => s._id.toString() === cartItem.sizeId,
      );

      if (!sizeData) continue;

      const availableQty = Math.min(cartItem.quantity, sizeData.stock);

      validatedItems.push({
        productId: product._id,
        sizeId: sizeData._id,
        name: product.name,
        size: sizeData.size,
        image: product.images[0]?.url,
        price: sizeData.discountPrice || sizeData.price,
        stock: sizeData.stock,
        requestedQty: cartItem.quantity,
        availableQty,
      });
    }

    res.json(validatedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cart validation failed" });
  }
};
