import { useEffect, useState } from "react";
import "./ConfigPanel.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ConfigPanel() {
  const [fleetSize, setFleetSize] = useState("");
  const [updateInterval, setUpdateInterval] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/config`)
      .then((response) => response.json())
      .then((data) => {
        setFleetSize(data.fleetSize);
        setUpdateInterval(data.updateInterval);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fleetSize: Number(fleetSize),
          updateInterval: Number(updateInterval),
        }),
      });

      const data = await response.json();

      console.log(data);
      alert("Configuration updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="config-panel">
      <div className="config-header">
        <div>
          <h2>Simulator Configuration</h2>
          <p>Change fleet settings without restarting the application</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="config-form">
        <div className="input-group">
          <label>Fleet Size</label>

          <input
            type="number"
            min="1"
            value={fleetSize}
            onChange={(event) => setFleetSize(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Update Interval (ms)</label>

          <input
            type="number"
            min="100"
            step="100"
            value={updateInterval}
            onChange={(event) => setUpdateInterval(event.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Apply Configuration"}
        </button>
      </form>
    </section>
  );
}

export default ConfigPanel;
