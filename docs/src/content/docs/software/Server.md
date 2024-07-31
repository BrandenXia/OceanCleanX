---
title: Remote Control Server
---

# Remote Control Server

A server is run on Jetson Nano to control the catamaran remotely. Currently, the server uses websocket to communicate with the client. The server is written in Python and uses the `websockets` library.

## Data

A sample data packet is shown below:

```json
{
  "type": "control",
  "direction": "0.5",
  "speed": "0.5",
}
```

Each data packet has a `type` field, which can be the following:

- `control`: Control the catamaran, with the `direction` and `speed` fields
  - `direction` and `speed` are both floating point numbers between -1 and 1
