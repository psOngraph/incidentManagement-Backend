const fs = require("fs");
const path = require("path");

const {
  createIncident,
  getAllIncident,
  updateIncident,
  deleteIncident,
} = require("../services/incidentService");

const incidentController = {
  create: async (req, res) => {
    try {
      // 1. Ensure a single folder is created for this incident
      const incidentFolder = `public/uploads/incident-${Date.now()}`;
      fs.mkdirSync(incidentFolder, { recursive: true }); // Create folder

      // 2. Process uploaded images
      const imagePaths = [];
      if (req.files) {
        req.files.forEach((file, index) => {
          const imageName = `image-${Date.now()}-${index}${path.extname(
            file.originalname
          )}`;
          const imagePath = path.join(incidentFolder, imageName);
          fs.writeFileSync(imagePath, file.buffer); // Save image to folder
          imagePaths.push(imagePath); // Save path to array
        });
      }

      // 3. Create incident document
      const {
        title,
        category,
        severity,
        comment,
        voiceNote,
        latitude,
        longitude,
      } = req.body;

      const incidentData = {
        title,
        category,
        severity,
        images: imagePaths, // Store paths to images
        comment,
        voiceNote,
        location: {
          latitude,
          longitude,
        },
        folderPath: incidentFolder, // Store folder path
      };

      const newIncident = await createIncident(incidentData);

      res.status(201).json({
        message: "Incident created successfully",
        incident: newIncident,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create incident" });
    }
  },
  getAll: async (req, res) => {
    try {
      const incidents = await getAllIncident();
      res.status(200).json(incidents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  },
  // Update Incident
  update: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch incident by ID
      const existingIncident = await Incident.findById(id);
      if (!existingIncident) {
        return res.status(404).json({ error: "Incident not found" });
      }

      // If new images are uploaded
      const imagePaths = existingIncident.images || [];
      if (req.files) {
        req.files.forEach((file, index) => {
          const imageName = `image-${Date.now()}-${index}${path.extname(
            file.originalname
          )}`;
          const imagePath = path.join(
            existingIncident.images[0]?.split("/").slice(0, -1).join("/"),
            imageName
          );
          fs.writeFileSync(imagePath, file.buffer);
          imagePaths.push(imagePath);
        });
      }

      // Update incident data
      const updatedData = {
        severity: req.body.severity || existingIncident.severity,
        comment: req.body.comment || existingIncident.comment,
        location: req.body.location
          ? JSON.parse(req.body.location)
          : existingIncident.location,
        images: imagePaths,
      };

      const updatedIncident = await updateIncident(id, updatedData);
      res.status(200).json({
        message: "Incident updated successfully",
        incident: updatedIncident,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update incident" });
    }
  },

  // Delete Incident
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await deleteIncident(id);
      if (!result) {
        return res.status(404).json({ error: "Incident not found" });
      }

      res.status(200).json({ message: "Incident deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete incident" });
    }
  },
};

module.exports = incidentController;
