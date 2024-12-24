const fs = require("fs");
const path = require("path");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected by this id: ${socket.id}`);

    // debug incoming events
    // socket.onAny((event, data) => {
    //   console.log(`Event received: ${event}`, data);
    // });

    try {
      // Dynamically load all socket event handlers
      const socketFiles = fs
        .readdirSync(__dirname)
        .filter((file) => file !== "index.js");

      socketFiles.forEach((file, idx) => {
        try {
          const socketHandler = require(path.join(__dirname, file));
          //   console.log("Loading handler:", file, "Type:", typeof socketHandler);

          if (typeof socketHandler === "function") {
            socketHandler(socket, io);
            // console.log(`Successfully registered handler for ${file}`);
          } else {
            console.warn(`Handler in ${file} is not a function`);
          }
        } catch (error) {
          console.error(`Error loading handler ${file}:`, error);
        }
      });
    } catch (error) {
      console.error("Error loading socket handlers:", error);
    }

    socket.on("disconnect", () => {
      console.log(`User disconnected by this id: ${socket.id}`);
    });

    //  Error handling for socket events
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
};
