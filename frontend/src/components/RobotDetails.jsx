import "./RobotDetails.css";

function RobotDetails({ robot, onClose }) {
  if (!robot) return null;

  const needsAttention = [
    "blocked",
    "error",
    "offline",
    "maintenance",
  ].includes(robot.status);

  return (
    <div className="details-overlay" onClick={onClose}>
      <div
        className="details-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="details-header">
          <div>
            <p>ROBOT DETAILS</p>
            <h2>{robot.robot_id}</h2>
          </div>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="details-content">
          <div className="detail-item">
            <span>Robot Type</span>
            <strong>{robot.robot_type}</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong className={`status ${robot.status}`}>
              {robot.status.replace("_", " ")}
            </strong>
          </div>

          <div className="detail-item">
            <span>Battery</span>
            <strong>{robot.battery.toFixed(1)}%</strong>
          </div>

          <div className="detail-item">
            <span>Position</span>
            <strong>
              X: {robot.x.toFixed(1)}, Y: {robot.y.toFixed(1)}
            </strong>
          </div>

          <div className="detail-item">
            <span>Last Updated</span>
            <strong>{new Date(robot.lastUpdated).toLocaleTimeString()}</strong>
          </div>
        </div>

        {needsAttention && (
          <div className="attention-message">
            ⚠️ This robot requires operator attention.
          </div>
        )}
      </div>
    </div>
  );
}

export default RobotDetails;
