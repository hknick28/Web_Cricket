const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

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
    console.log("Swing detected, Data from phone:", data);
    socket.broadcast.emit("swing", data);
  });

  socket.on("calibrate", () => {
    socket.broadcast.emit("calibrate");
  });

  socket.on("disconnect", () => {
    console.log("A device disconnected:", socket.id);
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
