const Category = require("../models/category.model");
const cloudinary = require("../config/cloudinary");

/* ========================================
   CREATE CATEGORY (ADMIN)
======================================== */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Category image is required",
      });
    }

    const formattedName = name.trim().toLowerCase();

    const existingCategory = await Category.findOne({
      name: formattedName,
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    // ✅ SAME LOGIC AS PRODUCT
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "categories" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      stream.end(req.file.buffer);
    });

    const category = await Category.create({
      name: formattedName,
      image: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ========================================
   GET ACTIVE CATEGORIES (USER)
======================================== */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};

/* ========================================
   GET ALL CATEGORIES (ADMIN)
======================================== */
exports.getCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};

/* ========================================
   UPDATE CATEGORY (ADMIN)
======================================== */
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // If new image uploaded
    if (req.file) {
      // delete old image
      await cloudinary.uploader.destroy(category.image.public_id);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });

      category.image = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    if (req.body.name) {
      category.name = req.body.name.trim().toLowerCase();
    }

    if (req.body.isActive !== undefined) {
      category.isActive = req.body.isActive;
    }

    await category.save();

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({
      message: "Failed to update category",
    });
  }
};

/* ========================================
   DELETE CATEGORY (ADMIN)
======================================== */
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Delete Cloudinary image
    await cloudinary.uploader.destroy(category.image.public_id);

    await category.deleteOne();

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({
      message: "Failed to delete category",
    });
  }
};
