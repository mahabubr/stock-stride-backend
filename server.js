const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const companyRoutes = require("./routes/company");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins or specify your frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/companies", companyRoutes);

// Function to generate random stock prices
const getRandomStockData = (previousClose) => {
  const open = previousClose + (Math.random() - 0.5) * 10; // Random open price around previous close
  const high = open + Math.random() * 10; // High price can be above the open
  const low = open - Math.random() * 10; // Low price can be below the open
  const close = low + Math.random() * (high - low); // Close price between low and high
  return [open, high, low, close];
};

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected");

  // Initial close price for the first data point
  let lastClosePrice = 100; // You can start with any base value

  // Emit stock data at regular intervals or based on events
  const sendStockData = () => {
    const stockDataPoint = {
      x: new Date().toISOString(),
      y: getRandomStockData(lastClosePrice),
    };

    // Update lastClosePrice for the next data point
    lastClosePrice = stockDataPoint.y[3]; // Use the close price as the new last close price

    socket.emit("stockData", [stockDataPoint]); // Emit as an array for compatibility
  };

  // Send stock data every second
  const intervalId = setInterval(sendStockData, 1000);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(intervalId); // Clear the interval when client disconnects
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
