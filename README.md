# Fleet Management Dashboard

A real-time fleet management dashboard built for monitoring and simulating autonomous robots.

The application simulates a configurable fleet of robots and displays live updates including robot position, battery level, operational status, and fleet statistics.

The system uses Socket.IO for real-time communication between the backend and frontend.

---

## Features

### Real-Time Robot Monitoring

- Live robot position updates
- Real-time battery monitoring
- Robot status tracking
- Live connection status indicator
- Socket.IO-based communication

### Fleet Dashboard

- Total robot count
- Active robots
- Charging robots
- Robots needing attention
- Live fleet statistics

### Robot Management

- Search robots by Robot ID
- Search robots by status
- Needs Attention filter
- Robot detail panel
- Battery status monitoring

### Site Map

- Visual representation of robot positions
- Real-time robot movement
- Site boundary constraints
- Status-based robot markers

### Trend Chart

- Fleet activity visualization
- Live trend updates
- Multiple time window options

### Dynamic Configuration

The simulator can be configured directly from the dashboard.

Supported configuration:

- Fleet size
- Update interval

### Robot Simulation

The simulator includes:

- Random robot movement
- Battery drain
- Charging behavior
- Status transitions
- Site boundary constraints
- Configurable fleet size
- Configurable update interval

---

## Tech Stack

### Frontend

- React
- Vite
- Socket.IO Client
- CSS

### Backend

- Node.js
- Express.js
- Socket.IO

### Testing

- Vitest
- Unit Testing

---

## Architecture

Robot Simulator
↓
Express Backend
↓
Socket.IO
↓
React Application
↓
Dashboard Components
