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

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/companies", companyRoutes);

const getRandomStockData = (previousClose) => {
  const open = previousClose + (Math.random() - 0.5) * 10;
  const high = open + Math.random() * 10;
  const low = open - Math.random() * 10;
  const close = low + Math.random() * (high - low);
  return [open, high, low, close];
};

io.on("connection", (socket) => {
  console.log("New client connected");

  let lastClosePrice = 100;

  const sendStockData = () => {
    const stockDataPoint = {
      x: new Date().toISOString(),
      y: getRandomStockData(lastClosePrice),
    };

    lastClosePrice = stockDataPoint.y[3];

    socket.emit("stockData", [stockDataPoint]);
  };

  const intervalId = setInterval(sendStockData, 1000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(intervalId);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
