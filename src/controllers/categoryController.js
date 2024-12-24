const Category = require("../models/Category");
const { findByIdAndUpdate } = require("../models/Notification");

const categoryController = {
  // Create Category
  create: async (req, res) => {
    try {
      const { title, type, severity } = req.body;

      // Create a new category
      const newCategory = new Category({
        title,
        type,
        severity,
        createdAt: new Date(),
      });

      // Save the category
      await newCategory.save();

      res.status(201).json({
        message: "Category created successfully",
        category: newCategory,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create category" });
    }
  },
  getAll: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  },
  // Update Category
  update: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch category by ID
      const existingCategory = await Category.findById(id);
      if (!existingCategory) {
        return res.status(404).json({ error: "Category not found" });
      }

      // Update category fields
      const updatedData = {
        title: req.body.title || existingCategory.title,
        type: req.body.type || existingCategory.type,
        severity: req.body.severity || existingCategory.severity,
      };

      const updatedCategory = await findByIdAndUpdate(id, updatedData);
      res.status(200).json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update category" });
    }
  },

  // Delete Category
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await Category.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  },
};

module.exports = categoryController;
