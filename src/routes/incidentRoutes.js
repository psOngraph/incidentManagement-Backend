const express = require("express");
const multer = require("multer");

const incidentController = require("../controllers/incidentController");

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage(); // Use memory storage temporarily
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).array("images", 10); // Allow up to 10 images

// Route for creating incidents
router.post("/create", upload, incidentController.create);
router.get("/all", incidentController.getAll);
router.put("/update/:id", upload, incidentController.update); // Update incident
router.delete("/delete/:id", incidentController.delete); // Delete incident

module.exports = router;
