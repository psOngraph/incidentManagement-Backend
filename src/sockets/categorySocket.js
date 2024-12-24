const Category = require("../models/Category"); // Import Category model

module.exports = (socket, io) => {
  // Save Category
  socket.on("saveCategory", async (data) => {
    try {
      const category = new Category(data);
      const savedCategory = await category.save();
      io.emit("categorySaved", {
        message: "Category saved successfully",
        category: savedCategory,
      });
    } catch (error) {
      socket.emit("error", { message: "Failed to save category", error });
    }
  });

  // Fetch All Categories
  socket.on("fetchAllCategories", async () => {
    try {
      const categories = await Category.find();
      socket.emit("allCategories", categories);
    } catch (error) {
      socket.emit("error", { message: "Failed to fetch categories", error });
    }
  });

  // Other category-related events can be added here...
};
