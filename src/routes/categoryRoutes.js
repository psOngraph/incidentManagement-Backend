const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// Route to create a new category
router.post("/create", categoryController.create);
router.get("/all", categoryController.getAll);
router.put("/update/:id", categoryController.update); // Update incident
router.delete("/delete/:id", categoryController.delete); // Delete incident
module.exports = router;
