# ARCHITECTURE

## 1. System Overview

The Fleet Management Dashboard is a real-time application that simulates and monitors a fleet of robots.

The system consists of three main layers:

1. Robot Simulator
2. Backend Server
3. React Frontend Dashboard

The simulator generates robot data and continuously updates robot positions, battery levels, and statuses. The backend manages the fleet state and broadcasts updates to connected clients using Socket.IO. The React frontend receives these updates and displays them in real time.

---

## 2. High-Level Architecture

```text
┌─────────────────────┐
│   Robot Simulator   │
│                     │
│ • Movement          │
│ • Battery Updates   │
│ • Status Changes    │
└──────────┬──────────┘
           │
           │ Robot Updates
           ▼
┌─────────────────────┐
│   Express Backend   │
│                     │
│ • Fleet State       │
│ • REST APIs         │
│ • Configuration     │
└──────────┬──────────┘
           │
           │ Socket.IO Events
           ▼
┌─────────────────────┐
│   React Frontend    │
│                     │
│ • Dashboard         │
│ • Robot List        │
│ • Search / Filter   │
│ • Site Map          │
│ • Trend Chart       │
└─────────────────────┘
```
