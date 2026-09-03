const DEFAULT_CONFIG = {
  fleetSize: Number(process.env.FLEET_SIZE) || 8,
  updateInterval: Number(process.env.UPDATE_INTERVAL) || 1000,
  siteWidth: Number(process.env.SITE_WIDTH) || 1000,
  siteHeight: Number(process.env.SITE_HEIGHT) || 600,
  payloadSize: process.env.PAYLOAD_SIZE || "normal",
};

const statuses = [
  "idle",
  "active",
  "on_mission",
  "charging",
  "blocked",
  "error",
  "maintenance",
  "offline",
];

class RobotSimulator {
  constructor(onUpdate, config = {}) {
    this.onUpdate = onUpdate;
    this.robots = [];
    this.interval = null;

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  formatPayload(robot) {
    // Minimal payload
    if (this.config.payloadSize === "minimal") {
      return {
        robot_id: robot.robot_id,
        robot_type: robot.robot_type,
        x: robot.x,
        y: robot.y,
        battery: robot.battery,
        status: robot.status,
        lastUpdated: robot.lastUpdated,
      };
    }

    // Large payload
    if (this.config.payloadSize === "large") {
      return {
        ...robot,
        metadata: {
          locationAccuracy: Math.random() * 5,
          temperature: 20 + Math.random() * 15,
          speed: Math.random() * 10,
          signalStrength: Math.floor(Math.random() * 100),
          diagnostics: {
            motorHealth: "good",
            sensorHealth: "good",
            navigationHealth: "good",
          },
        },
      };
    }

    // Normal payload
    return robot;
  }

  createFleet() {
    this.robots = Array.from({ length: this.config.fleetSize }, (_, index) => ({
      robot_id: `r${index + 1}`,

      robot_type: index % 2 === 0 ? "AMR" : "Cleaning Robot",

      x: Math.random() * this.config.siteWidth,
      y: Math.random() * this.config.siteHeight,

      battery: Math.floor(Math.random() * 40) + 60,

      status: Math.random() > 0.5 ? "idle" : "active",

      lastUpdated: Date.now(),
    }));

    return this.robots;
  }

  updateConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }

  getConfig() {
    return this.config;
  }

  updateRobot(robot) {
    // Low battery → charging
    if (robot.battery <= 20) {
      robot.status = "charging";
    }

    // Charging behavior
    if (robot.status === "charging") {
      robot.battery = Math.min(100, robot.battery + Math.random() * 5);

      if (robot.battery >= 90) {
        robot.status = "idle";
      }

      robot.lastUpdated = Date.now();

      return robot;
    }

    // Movement
    if (["active", "on_mission"].includes(robot.status)) {
      const speed = 10;

      robot.x += (Math.random() - 0.5) * speed;
      robot.y += (Math.random() - 0.5) * speed;

      // Keep robot inside site boundaries
      robot.x = Math.max(0, Math.min(this.config.siteWidth, robot.x));

      robot.y = Math.max(0, Math.min(this.config.siteHeight, robot.y));

      // Battery drain
      robot.battery = Math.max(0, robot.battery - Math.random() * 2);
    }

    // Random sensible status change
    if (Math.random() < 0.05) {
      const possibleStatuses = ["idle", "active", "on_mission", "blocked"];

      robot.status =
        possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
    }

    robot.lastUpdated = Date.now();

    return robot;
  }

  start() {
    this.createFleet();

    // Send newly created robots immediately
    this.robots.forEach((robot) => {
      this.onUpdate(this.formatPayload(robot));
    });

    this.interval = setInterval(() => {
      this.robots = this.robots.map((robot) => {
        const updatedRobot = this.updateRobot(robot);

        // Format payload based on configured payload size
        this.onUpdate(this.formatPayload(updatedRobot));

        return updatedRobot;
      });
    }, this.config.updateInterval);

    console.log(`Robot simulator started with ${this.config.fleetSize} robots`);

    console.log(`Payload size mode: ${this.config.payloadSize}`);
  }

  stop() {
    clearInterval(this.interval);
  }
}

export default RobotSimulator;
