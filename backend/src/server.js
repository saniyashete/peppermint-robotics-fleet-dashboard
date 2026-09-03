import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import RobotSimulator from "./simulator/robotSimulator.js";

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Store current fleet state
const fleetState = new Map();

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Fleet Management Backend Running",
  });
});

// Get current robots
app.get("/api/robots", (req, res) => {
  res.json([...fleetState.values()]);
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Dashboard connected:", socket.id);

  // Send current fleet immediately when dashboard connects
  socket.emit("fleet:initial", [...fleetState.values()]);

  socket.on("disconnect", () => {
    console.log("Dashboard disconnected:", socket.id);
  });
});

const simulator = new RobotSimulator((robot) => {
  fleetState.set(robot.robot_id, robot);

  io.emit("robot:update", robot);
});

app.get("/api/config", (req, res) => {
  res.json(simulator.getConfig());
});
app.put("/api/config", (req, res) => {
  const { fleetSize, updateInterval } = req.body;

  simulator.updateConfig({
    ...(fleetSize && { fleetSize: Number(fleetSize) }),
    ...(updateInterval && { updateInterval: Number(updateInterval) }),
  });

  // Stop old simulator
  simulator.stop();

  // Clear old robots
  fleetState.clear();

  // Start simulator with new config
  simulator.start();

  // Send new fleet to connected clients
  io.emit("fleet:initial", simulator.robots);

  res.json({
    message: "Configuration updated successfully",
    config: simulator.getConfig(),
  });
});
simulator.start();

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
