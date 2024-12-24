const {
  createIncident,
  getAllIncident,
  updateIncident,
  deleteIncident,
  saveOrUpdateDevice,
  findNearbyIncidents,
  sendPushNotifications,
} = require("../services/incidentService.js");

module.exports = (socket, io) => {
  // Debug log to confirm handler is loaded
  console.log("Incident handler initialized for socket:", socket.id);
  // Save Incident
  socket.on("saveIncident", async (data) => {
    try {
      //   const incident = new Incident(data);
      const savedIncident = await createIncident(data);

      // Add debug log before emitting
      console.log("Emitting incidentSaved event");

      io.emit("incidentSaved", {
        status: "success",
        message: "Incident saved successfully",
        incident: savedIncident,
      });

      // Add debug log after emitting
      console.log("incidentSaved event emitted");
    } catch (error) {
      console.error("Error in saveIncident:", error);
      socket.emit("error", { message: "Failed to save incident", error });
    }
  });

  // Fetch All Incidents
  socket.on("fetchAllIncidents", async () => {
    try {
      const incidents = await getAllIncident();
      console.log("all Incidnet going to emit");
      socket.emit("allIncidents", incidents);
      console.log("all Incidnet event emitted");
    } catch (error) {
      socket.emit("error", { message: "Failed to fetch incidents", error });
    }
  });

  // Update Incident
  socket.on("updateIncident", async ({ id, updatedData }) => {
    try {
      const updatedIncident = await updateIncident(id, updatedData);
      if (!updatedIncident) {
        socket.emit("error", { message: "Incident not found" });
      } else {
        io.emit("incidentUpdated", {
          status: "success",
          message: "Incident updated successfully",
          incident: updatedIncident,
        });
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to update incident", error });
    }
  });

  // Delete Incident
  socket.on("deleteIncident", async ({ id }) => {
    try {
      const deletedIncident = await deleteIncident(id);
      if (!deletedIncident) {
        socket.emit("error", { message: "Incident not found" });
      } else {
        io.emit("incidentDeleted", {
          status: "success",
          message: "Incident deleted successfully",
          id,
        });
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to delete incident", error });
    }
  });

  //   To check the location

  socket.on("shareLocation", async (data) => {
    try {
      const { latitude, longitude, deviceId, notificationToken } = data;

      // Save or update device information
      const device = await saveOrUpdateDevice(deviceId, notificationToken);

      // Find nearby incidents
      const nearbyIncidents = await findNearbyIncidents(latitude, longitude);

      if (nearbyIncidents.length > 0) {
        // Fetch all devices from the database
        // const devices = await Device.find();
        // const tokens = devices.map((device) => device.notificationToken);

        // Send push notifications
        await sendPushNotifications(
          device.notificationToken,
          nearbyIncidents.length
        );

        socket.emit("notificationSent", {
          status: "success",
          message: "Notifications sent successfully",
          //   nearbyIncidentsCount: nearbyIncidents.length,
        });
      } else {
        socket.emit("noIncidents", { message: "No incidents nearby" });
      }
    } catch (error) {
      console.error("Error handling shareLocation event:", error);
      socket.emit("error", { message: "An error occurred", error });
    }
  });

  // catch-all event listener in this handler
  //   socket.onAny((eventName, ...args) => {
  //     console.log(
  //       `Event '${eventName}' received in incident handler with args:`,
  //       args
  //     );
  //   });
};
