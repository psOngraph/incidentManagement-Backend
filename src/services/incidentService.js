// const fs = require("fs");
const Incident = require("../models/Incident");
const Device = require("../models/Device");
const { calculateDistance } = require("../utils/helper");
const Admin = require("../config/firebase");

// Serivce to create an incident
const createIncident = async (incidentData) => {
  console.log("incidentData", incidentData);
  const newIncident = new Incident({
    ...incidentData,
    createdAt: new Date(),
  });

  return await newIncident.save();
};

// Serivce to Fetch all incident
const getAllIncident = async () => {
  return await Incident.find();
};

// Serivce to update an incident
const updateIncident = async (id, updatedData) => {
  return await Incident.findByIdAndUpdate(id, updatedData, { new: true });
};

// Serivce to delete an incident
const deleteIncident = async (id) => {
  const incident = await Incident.findById(id);
  if (!incident) {
    return null;
  }

  // Delete folder containing the incident's images
  // if (fs.existsSync(incident?.folderPath)) {
  //   fs.rmdirSync(incident?.folderPath, { recursive: true });
  // }

  // Remove incident from database
  await Incident.findByIdAndDelete(id);
  return true;
};

// Send Push Notification to the devices which are in range of incident

const saveOrUpdateDevice = async (deviceId, notificationToken) => {
  try {
    const existingDevice = await Device.findOne({ deviceId });
    if (existingDevice) {
      existingDevice.notificationToken = notificationToken;
      console.log(`Device updated: ${deviceId}`);
      return await existingDevice.save();
    } else {
      const newDevice = new Device({ deviceId, notificationToken });
      console.log(`New device saved: ${deviceId}`);
      return await newDevice.save();
    }
  } catch (error) {
    console.error("Error saving or updating device:", error);
    throw error;
  }
};

const findNearbyIncidents = async (latitude, longitude) => {
  try {
    const incidents = await Incident.find();
    return incidents.filter((incident) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        incident.location.latitude,
        incident.location.longitude
      );
      return distance <= 5; // Distance less than 5 km
    });
  } catch (error) {
    console.error("Error finding nearby incidents:", error);
    throw error;
  }
};

const sendPushNotifications = async (tokens, nearbyIncidentCount) => {
  try {
    const message = {
      notification: {
        title: "Nearby Incident Alert",
        body: `There are ${nearbyIncidentCount} incidents near your location.`,
      },
      tokens, // List of device tokens
    };

    const response = await Admin.messaging().sendMulticast(message);
    console.log("Push notifications sent:", response);
  } catch (error) {
    console.error("Error sending push notifications:", error);
    throw error;
  }
};

module.exports = {
  createIncident,
  getAllIncident,
  updateIncident,
  deleteIncident,
  saveOrUpdateDevice,
  findNearbyIncidents,
  sendPushNotifications,
};
