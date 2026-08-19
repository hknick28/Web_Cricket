const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// server.js (Node.js Backend)
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve everything in the /public folder
app.use(express.static("public"));

// When a device connects via WebSocket
io.on("connection", (socket) => {
  console.log("A device connected:", socket.id);

  // When phone sends orientation data, forward it to everyone else
  socket.on("orientation", (data) => {
    socket.broadcast.emit("orientation", data);
  });

  socket.on("swing", (data) => {
    // console.log("Swing detected, Data from phone:", data);
    socket.broadcast.emit("swing", data);
  });

  socket.on("calibrate", () => {
    socket.broadcast.emit("calibrate");
  });

  socket.on("disconnect", () => {
    console.log("A device disconnected:", socket.id);
  });
  socket.on("saveCalibrationData", (profileData) => {
    const filePath = path.join(
      __dirname,
      "public",
      "calibration_profiles.json",
    );

    try {
      const dataString = JSON.stringify(profileData, null, 2);
      fs.writeFileSync(filePath, dataString, "utf8");
      console.log(
        "🚀 Success! Calibration file saved to server directory:",
        filePath,
      );
    } catch (error) {
      console.error("❌ Failed to save calibration file:", error);
    }
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  const os = require("os");

  //debugging
  const networkInterfaces = os.networkInterfaces();

  // show ip addr for testing
  const wifiInfo =
    networkInterfaces["Wi-Fi"] ||
    networkInterfaces["Wireless LAN adapter Wi-Fi"];
  const ipv4 = wifiInfo.find((details) => details.family === "IPv4");
  console.log("Server running at http://localhost:3000");
  console.log("On your phone visit: http://[", ipv4, "]:3000");
});
