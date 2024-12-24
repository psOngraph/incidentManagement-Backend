const http = require("http");
const app = require("./app");

const { Server } = require("socket.io");
const registerSocketHandlers = require("./sockets");

const server = http.createServer(app);
const io = new Server(server);

// Register socket handlers
registerSocketHandlers(io);

module.exports = server;
