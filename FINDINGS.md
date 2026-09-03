# FINDINGS

## 1. Overview

This document summarizes the technical decisions, tradeoffs, scalability observations, and limitations identified while building and testing the Fleet Management Dashboard.

The system simulates a fleet of robots, sends live updates through a backend service, and displays the current fleet state on a real-time React dashboard.

The application was tested with fleet sizes of 8, 100, 500, and 1000 robots to observe how the system behaves as the number of concurrent robot updates increases.

---

## 2. Architecture and Technology Tradeoffs

### Real-time Communication

I chose Socket.IO for real-time communication between the backend and frontend.

The main reason for this choice was that the dashboard needs continuously updated robot positions, battery levels, and statuses. Socket.IO provides an event-based communication model and handles connection and reconnection behavior.

### Why Socket.IO instead of REST polling?

REST polling would require the frontend to repeatedly request the latest fleet state.

This approach would create unnecessary HTTP requests, especially when the fleet size increases. With Socket.IO, updates can be pushed from the backend to connected dashboard clients.

### Tradeoff

The current implementation sends individual robot updates to the frontend. This works well for the tested fleet sizes, but frequent updates can increase frontend rendering work as the number of robots grows.

For a much larger fleet, I would consider batching updates or throttling the frequency of UI updates.

---

## 3. Simulator Design Decisions

The robot simulator generates a configurable fleet of robots.

Each robot contains:

- Robot ID
- Robot type
- X and Y position
- Battery percentage
- Status
- Last updated timestamp

The simulator models:

- Continuous movement
- Site boundary constraints
- Battery drain
- Charging behavior
- Status transitions

Robot movement is constrained within the configured site dimensions so that robots cannot move outside the map boundaries.

When battery levels become low, the robot transitions to a charging state. Charging increases the battery level until the robot can return to an idle state.

---

## 4. Scalability Testing

The system was tested with multiple fleet sizes using the live configuration controls.

| Fleet Size | Performance                 | UI Lag                                | Main Observation                                                   |
| ---------- | --------------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| 8          | Smooth and responsive       | None                                  | All features worked without issues                                 |
| 100        | Smooth and responsive       | No noticeable lag                     | Site map started becoming visually crowded                         |
| 500        | Mostly smooth               | Slight lag during frequent updates    | Robot markers overlapped and map readability decreased             |
| 1000       | Functional under heavy load | Noticeable compared to smaller fleets | Frontend rendering and map readability became the main bottlenecks |

### 8 Robots

The dashboard was smooth and responsive.

- Robot updates worked correctly
- Search and filtering worked correctly
- Trend chart updated correctly
- No noticeable UI lag
- No issues observed

### 100 Robots

The dashboard remained smooth and responsive.

- Robot updates continued working correctly
- Search and filter functionality remained responsive
- Trend chart continued updating
- No noticeable UI lag

The main observation was that the site map started becoming visually crowded because multiple robot markers could appear close to each other.

### 500 Robots

The application remained functional and mostly smooth.

- Robot updates continued working
- Search and filtering remained responsive
- Trend chart continued updating

However, slight UI lag became noticeable during frequent updates.

The site map also became visually dense, with increasing overlap between robot markers.

### 1000 Robots

The system remained functional under heavy load.

- The backend continued processing robot updates
- Search and filtering continued working
- The trend chart continued updating

However, frontend rendering became noticeably heavier compared to smaller fleet sizes.

The main challenges were:

- Rendering a large number of robot cards
- Rendering many robot markers simultaneously
- Frequent React state updates
- Reduced readability of the site map due to overlapping markers

---

## 5. Where the System Degrades

Based on the testing performed, the primary bottleneck appears to be frontend rendering rather than basic backend simulation.

The data flow is:

Robot Simulator
→ Backend
→ Socket.IO Events
→ React State Update
→ Robot Cards and Map Markers Re-render

At higher fleet sizes, a larger number of updates causes more frequent UI rendering.

The main degradation observed was:

1. Increased frontend rendering work
2. More crowded robot markers on the site map
3. Slight UI lag at higher fleet sizes
4. Reduced ability to visually distinguish individual robots

---

## 6. What I Would Improve for Larger Fleets

If the fleet size increased significantly beyond the tested range, the first improvements I would make are:

### Batch Robot Updates

Instead of processing every robot update individually in the UI, updates could be collected and applied in batches.

This would reduce the number of React state updates.

### Throttle UI Updates

The backend could continue receiving updates at a high frequency while the frontend renders aggregated updates at a controlled interval.

### Virtualize the Robot List

Rendering hundreds or thousands of robot cards simultaneously is unnecessary when only a subset is visible on screen.

A virtualization library could render only visible robot cards.

### Improve Map Rendering

For larger fleets, DOM-based markers could become inefficient.

Possible improvements include:

- Marker clustering
- Canvas rendering
- WebGL rendering
- Zoom-based aggregation

These approaches would improve both performance and map readability.

---

## 7. What Was Intentionally Kept Simple

To focus on the core requirements of the challenge, the current implementation keeps some areas intentionally simple.

The system does not currently persist long-term robot history in a database.

The optional robot history endpoint was not implemented because the main focus was building and validating the live simulation, backend ingestion, real-time dashboard, dynamic configuration, and scalability behavior.

---

## 8. What I Would Build Next

The next improvements I would prioritize are:

1. Persistent robot history storage
2. Historical API for individual robots
3. Batched real-time updates
4. Virtualized robot list
5. Map clustering or canvas-based rendering
6. More detailed performance metrics
7. Monitoring and logging for production deployments
8. Role-based authentication for dashboard operators

---

## 9. Conclusion

The system performs smoothly for small and medium fleet sizes and remains functional at 1000 robots.

The scalability testing showed that the primary limitations at higher fleet sizes are frontend rendering and map readability rather than the core simulation flow.

The current architecture provides a functional foundation for a real-time fleet management system, while the findings from testing identify clear areas for improvement if the fleet grows significantly further.
