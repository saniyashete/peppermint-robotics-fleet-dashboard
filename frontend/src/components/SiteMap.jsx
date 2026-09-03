import "./SiteMap.css";

function SiteMap({ robots }) {
  const SITE_WIDTH = 1000;
  const SITE_HEIGHT = 600;

  const getRobotColor = (status) => {
    if (["error", "blocked", "offline", "maintenance"].includes(status)) {
      return "#ef4444";
    }

    if (status === "charging") {
      return "#f59e0b";
    }

    if (["active", "on_mission"].includes(status)) {
      return "#22c55e";
    }

    return "#6b7280";
  };

  return (
    <div className="site-map-container">
      <div className="map-header">
        <div>
          <h2>Live Site Map</h2>
          <p>Real-time robot positions</p>
        </div>

        <div className="map-legend">
          <span>🟢 Active</span>
          <span>🟡 Charging</span>
          <span>🔴 Attention</span>
        </div>
      </div>

      <div
        className="site-map"
        style={{
          aspectRatio: `${SITE_WIDTH}/${SITE_HEIGHT}`,
        }}
      >
        {/* Grid background */}
        <div className="grid-overlay" />

        {robots.map((robot) => {
          const left = (robot.x / SITE_WIDTH) * 100;
          const top = (robot.y / SITE_HEIGHT) * 100;

          return (
            <div
              key={robot.robot_id}
              className="robot-marker"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: getRobotColor(robot.status),
              }}
              title={`${robot.robot_id} - ${robot.status}`}
            >
              <span>{robot.robot_id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SiteMap;
