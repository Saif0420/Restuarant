const express = require("express");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;

// HTTP route
app.get("/", (req, res) => {
    res.send("ByteBites backend is running!");
});

// Starting of HTTP Server
const server = app.listen(PORT, () => {
    console.log(`ByteBites server running on port ${PORT}`);
});

