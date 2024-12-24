const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const notificationRoutes = require("./routes/notificationRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const errorHandler = require("./utils/errorHandler");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "../public")));

app.use("/api/notifications", notificationRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/category", categoryRoutes);

app.use(errorHandler);

module.exports = app;
