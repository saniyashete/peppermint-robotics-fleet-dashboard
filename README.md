# Fleet Management Dashboard

A real-time Fleet Management Dashboard for monitoring and managing autonomous robots.

## Features

- Real-time robot updates using Socket.IO
- Live fleet statistics
- Interactive site map showing robot positions
- Robot search and filtering
- Needs Attention filter
- Detailed robot information panel
- Fleet activity trend chart
- Configurable fleet size
- Configurable update interval
- Low battery indication
- Responsive dashboard UI

## Tech Stack

### Frontend

- React
- Vite
- Socket.IO Client
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- Socket.IO

## Project Structure

Pepermint_Robotics/
│
├── backend/
│ ├── simulator/
│ │ └── robotSimulator.js
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── ConfigPanel.jsx
│ │ │ ├── RobotDetails.jsx
│ │ │ ├── SiteMap.jsx
│ │ │ └── TrendChart.jsx
│ │ ├── App.jsx
│ │ └── App.css
│ ├── .env
│ └── package.json
│
└── README.md
