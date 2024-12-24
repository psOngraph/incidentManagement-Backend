require("dotenv").config();
const connectDB = require("./config/database");
const server = require("./server");

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
