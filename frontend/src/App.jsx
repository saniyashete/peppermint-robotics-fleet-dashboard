import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import ConfigPanel from "./components/ConfigPanel";
import RobotDetails from "./components/RobotDetails";
import SiteMap from "./components/SiteMap";
import TrendChart from "./components/TrendChart";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const socket = io(API_URL);
function App() {
  const [robots, setRobots] = useState([]);
  const [connected, setConnected] = useState(false);
  const [search, setSearch] = useState("");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to backend");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("fleet:initial", (fleet) => {
      setRobots(fleet);
    });

    socket.on("robot:update", (updatedRobot) => {
      setRobots((previousRobots) => {
        const exists = previousRobots.some(
          (robot) => robot.robot_id === updatedRobot.robot_id,
        );

        if (!exists) {
          return [...previousRobots, updatedRobot];
        }

        return previousRobots.map((robot) =>
          robot.robot_id === updatedRobot.robot_id ? updatedRobot : robot,
        );
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("fleet:initial");
      socket.off("robot:update");
    };
  }, []);

  const stats = useMemo(() => {
    return {
      total: robots.length,

      active: robots.filter((robot) =>
        ["active", "on_mission"].includes(robot.status),
      ).length,

      charging: robots.filter((robot) => robot.status === "charging").length,

      attention: robots.filter((robot) =>
        ["blocked", "error", "offline", "maintenance"].includes(robot.status),
      ).length,
    };
  }, [robots]);

  const filteredRobots = useMemo(() => {
    return robots.filter((robot) => {
      const matchesSearch =
        robot.robot_id.toLowerCase().includes(search.toLowerCase()) ||
        robot.status.toLowerCase().includes(search.toLowerCase());

      const needsAttention = [
        "blocked",
        "error",
        "offline",
        "maintenance",
      ].includes(robot.status);

      return attentionOnly ? matchesSearch && needsAttention : matchesSearch;
    });
  }, [robots, search, attentionOnly]);

  return (
    <div className="dashboard">
      <header>
        <div>
          <h1>Fleet Management Dashboard</h1>
          <p>Real-time Robot Monitoring System</p>
        </div>

        <div className={`connection ${connected ? "online" : "offline"}`}>
          {connected ? "🟢 Live" : "🔴 Disconnected"}
        </div>
      </header>

      {/* Stats */}
      <section className="stats">
        <div className="stat-card">
          <p>Total Robots</p>
          <h2>{stats.total}</h2>
        </div>

        <div className="stat-card">
          <p>Active</p>
          <h2>{stats.active}</h2>
        </div>

        <div className="stat-card">
          <p>Charging</p>
          <h2>{stats.charging}</h2>
        </div>

        <div className="stat-card">
          <p>Needs Attention</p>
          <h2>{stats.attention}</h2>
        </div>
      </section>

      <ConfigPanel />
      <TrendChart robots={robots} />

      {/* Site Map */}
      <SiteMap robots={robots} />

      {/* Robot List */}
      <section className="robots-section">
        <div className="section-header">
          <div>
            <h2>Live Robot Fleet</h2>
            <span>{filteredRobots.length} robots shown</span>
          </div>

          <div className="controls">
            <input
              type="text"
              placeholder="Search robot or status..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button
              className={attentionOnly ? "filter-active" : ""}
              onClick={() => setAttentionOnly((previous) => !previous)}
            >
              ⚠ Needs Attention
            </button>
          </div>
        </div>

        <div className="robot-grid">
          {filteredRobots.length > 0 ? (
            filteredRobots.map((robot) => (
              <div
                className="robot-card"
                key={robot.robot_id}
                onClick={() => setSelectedRobot(robot)}
              >
                <div className="robot-header">
                  <h3>{robot.robot_id}</h3>

                  <span className={`status ${robot.status}`}>
                    {robot.status.replace("_", " ")}
                  </span>
                </div>

                <p>{robot.robot_type}</p>

                <div className="robot-info">
                  <span>
                    📍 {robot.x.toFixed(1)}, {robot.y.toFixed(1)}
                  </span>

                  <span
                    className={
                      robot.battery < 20 ? "battery low-battery" : "battery"
                    }
                  >
                    🔋 {robot.battery.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>No robots found</h3>
              <p>Try changing your search or filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Robot Details */}
      <RobotDetails
        robot={selectedRobot}
        onClose={() => setSelectedRobot(null)}
      />
    </div>
  );
}

export default App;
