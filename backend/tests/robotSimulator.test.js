import { describe, expect, it } from "vitest";
import RobotSimulator from "../src/simulator/robotSimulator.js";

describe("RobotSimulator", () => {
  it("should create the configured number of robots", () => {
    const simulator = new RobotSimulator(() => {}, {
      fleetSize: 10,
    });

    const robots = simulator.createFleet();

    expect(robots).toHaveLength(10);
  });

  it("should keep active robots inside site boundaries", () => {
    const simulator = new RobotSimulator(() => {}, {
      siteWidth: 100,
      siteHeight: 100,
    });

    const robot = {
      robot_id: "r1",
      robot_type: "AMR",
      x: 100,
      y: 100,
      battery: 80,
      status: "active",
      lastUpdated: Date.now(),
    };

    const updatedRobot = simulator.updateRobot(robot);

    expect(updatedRobot.x).toBeGreaterThanOrEqual(0);
    expect(updatedRobot.x).toBeLessThanOrEqual(100);

    expect(updatedRobot.y).toBeGreaterThanOrEqual(0);
    expect(updatedRobot.y).toBeLessThanOrEqual(100);
  });

  it("should switch low battery robot to charging", () => {
    const simulator = new RobotSimulator(() => {});

    const robot = {
      robot_id: "r1",
      robot_type: "AMR",
      x: 50,
      y: 50,
      battery: 15,
      status: "active",
      lastUpdated: Date.now(),
    };

    const updatedRobot = simulator.updateRobot(robot);

    expect(updatedRobot.status).toBe("charging");
    expect(updatedRobot.battery).toBeGreaterThanOrEqual(15);
  });

  it("should update simulator configuration", () => {
    const simulator = new RobotSimulator(() => {});

    simulator.updateConfig({
      fleetSize: 20,
      updateInterval: 500,
    });

    const config = simulator.getConfig();

    expect(config.fleetSize).toBe(20);
    expect(config.updateInterval).toBe(500);
  });
});
