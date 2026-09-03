import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./TrendChart.css";

function TrendChart({ robots }) {
  const [history, setHistory] = useState([]);
  const [timeWindow, setTimeWindow] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      if (robots.length === 0) return;

      const activeCount = robots.filter((robot) =>
        ["active", "on_mission"].includes(robot.status),
      ).length;

      const activePercentage = Number(
        ((activeCount / robots.length) * 100).toFixed(1),
      );

      const newPoint = {
        time: new Date().toLocaleTimeString(),
        active: activePercentage,
      };

      setHistory((previous) => {
        const updated = [...previous, newPoint];

        return updated.slice(-60);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [robots]);

  const visibleHistory = history.slice(-timeWindow);

  return (
    <section className="trend-chart-container">
      <div className="chart-header">
        <div>
          <h2>Fleet Activity Trend</h2>
          <p>Percentage of active robots over time</p>
        </div>

        <div className="chart-controls">
          <button
            className={timeWindow === 10 ? "active-window" : ""}
            onClick={() => setTimeWindow(10)}
          >
            10 Points
          </button>

          <button
            className={timeWindow === 30 ? "active-window" : ""}
            onClick={() => setTimeWindow(30)}
          >
            30 Points
          </button>

          <button
            className={timeWindow === 60 ? "active-window" : ""}
            onClick={() => setTimeWindow(60)}
          >
            60 Points
          </button>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleHistory}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" minTickGap={30} />

            <YAxis domain={[0, 100]} unit="%" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="active"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              name="Active Robots"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default TrendChart;
